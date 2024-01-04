import {CardItem, CardItemEnum, createCardItemFromObj} from "./card-items/card-item";
import {MemoryNode} from "./memory-node";
import {CARDS_SERVICE, MEMORY_NODES_SERVICE} from "../services/contianer";
import {IQuizState} from "../libs/quiz.lib";
import chalk from "chalk";
import {getUserInput, tab, waitForUserInput} from "ag-utils-lib";
import {newLineConcatStringReducer} from "../libs/utils.lib";
import {some} from "lodash";
import {getCardItemsInHTML} from "../libs/cards.lib";
import {showHTMLInBrowser} from "../libs/utils/browser.utils";
import {TextCardItem} from "./card-items/text-card-item";
import {printParentsPath} from "../libs/memory-nodes.lib";

export type UsageType = 'active' | 'passive' | 'transitional' | 'common';

export class Card {
  _id: number;
  question: CardItem[] = [];
  answer: CardItem[] = [];
  parentNodes: number[] = [];
  used = 0;
  needed = 0;
  count = 0;
  reverseCount?: number;
  usageType: UsageType = 'common'

  constructor(_id: number, question: CardItem[], answer: CardItem[], parentNodes: number[],
              count: number, needed: number, used: number,
              others: {
                reverseCount: number,
                usageType: UsageType
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
    if (others.usageType !== undefined) {
      this.usageType = others.usageType;
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

  async printQuestion() {
    console.log(tab('Question: '));
    if (some(this.question, item => item.type === CardItemEnum.IMAGE)) {
      const html = getCardItemsInHTML(this.question);
      await showHTMLInBrowser(html);

    } else {
      this.question.forEach((cardItem: CardItem) => {
        console.log(tab(cardItem.getString(), 2));
      });
    }
  }

  getQuestionHTML(): string {
    return this.question
    .map((cardItem: CardItem) => cardItem.getHTML())
    .reduce(newLineConcatStringReducer);
  }

  async printAnswer() {
    console.log(tab('Answer: '));
    if (some(this.answer, item => item.type === CardItemEnum.IMAGE)) {
      const html = getCardItemsInHTML(this.answer);
      await showHTMLInBrowser(html);
    }
    this.answer.forEach((cardItem: CardItem) => {
      console.log(tab(cardItem.getString(), 2));
    });
    console.log();
  }

  getAnswerHTML(): string {
    return this.answer
    .map((cardItem: CardItem) => cardItem.getHTML())
    .reduce(newLineConcatStringReducer);
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

  save() {
    CARDS_SERVICE.updateCard(this);
  }

  async interactive(): Promise<void> {
    let command;
    while (true) {
      console.clear();
      printParentsPath(this.getParentNodes()[0]);
      await this.printQuestion();
      command = await getUserInput('Enter a command');
      if (command === 'a') {
        await this.printAnswer();
        await waitForUserInput();
      }
      if (command === 'x') {
        return;
      }
    }

  }
}
