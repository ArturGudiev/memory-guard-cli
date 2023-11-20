import {CardItem, createCardItemFromObj, TextCardItem} from "./card-item";
import {MemoryNode} from "./memory-node";
import {CARDS_SERVICE, MEMORY_NODES_SERVICE} from "../services/contianer";
import {IQuizState} from "../libs/quiz.lib";
import chalk from "chalk";
import {tab} from "../libs/utils.lib";

type UsageType = 'active' | 'passive' | 'transitional' | 'common';

export class Card {
  _id: number;
  question: CardItem[] = [];
  answer: CardItem[] = [];
  parentNodes: number[] = [];
  used = 0;
  needed = 0;
  count = 0;
  reverseCount?: number;
  usage: UsageType = 'common'

  constructor(_id: number, question: CardItem[], answer: CardItem[], parentNodes: number[],
              count: number, needed: number, used: number,
              others: {
                reverseCount: number,
                usage: UsageType
              }) {
    this._id = _id;
    this.question = question;
    this.answer = answer;
    this.parentNodes = parentNodes;
    this.used = used;
    this.needed = needed;
    this.count = count;
    if (others.reverseCount !== undefined) {
      this.reverseCount = others.reverseCount;
    }
    if (others.usage !== undefined) {
      this.usage = others.usage;
    }
  }

  static createFromObj(obj: any): Card {
    const question = obj.question.map((qObj: TextCardItem) => createCardItemFromObj(qObj));
    const answer = obj.answer.map((aObj: TextCardItem) => createCardItemFromObj(aObj));
    return new Card(obj._id, question, answer, obj.parentNodes, obj.count, obj.needed, obj.used, obj);
  }

  getParentNodes(): MemoryNode[] {
    return MEMORY_NODES_SERVICE.getMemoryNodesByIDs(this.parentNodes);
  }

  update() {
    CARDS_SERVICE.updateCard(this);
  }

  increaseCount(): void {
    this.count += 1;
    this.update();
  }

  decreaseCount(): void {
    if (this.count > 0) {
      this.count -= 1;
    }
    this.update();
  }

  getOneLineQuestion() {
    return this.question[0].getOneLineText();
  }

  printQuestion() {
    console.log(tab('Question: '));
    this.question.forEach((cardItem: CardItem) => {
      console.log(tab(cardItem.getString(), 2));
    });
  }

  printAnswer() {
    console.log(tab('Answer: '));
    this.answer.forEach((cardItem: CardItem) => {
      console.log(tab(cardItem.getString(), 2));
    });
    console.log();
  }


  printStats(quizState: IQuizState | null) {
    if (quizState !== null) {
      const rightPart = this.count === quizState.originalCount
        ? `( ${this.count} )`
        : `(${quizState.originalCount} – ${this.count})`;
      console.log(`\n\t(${chalk.green(quizState.leftCardsNumber)}) – ${chalk.yellow(rightPart)}\n`);
      // console.log(`COUNT: ${this.count}\n`);
      // console.log(`ORIGINAL COUNT: ${quizState.originalCount}`);
    } else {
      console.log(`COUNT: ${this.count}\n`);
    }
  }
}
