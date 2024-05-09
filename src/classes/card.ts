import { exit, getInputFromEditor, getUserInput, tab, waitForUserInput } from "ag-utils-lib";
import chalk from "chalk";
import { printParentsPath } from "../libs/memory-nodes.lib";
import { IQuizState } from "../libs/quiz.lib";
import { newLineConcatStringReducer } from "../libs/utils.lib";
import { CARDS_API_SERVICE, MEMORY_NODES_API_SERVICE } from "../services/contianer";
import { CardItem, createCardItemFromObj } from "./card-items/card-item";
import { TextCardItem } from "./card-items/text-card-item";
import { MemoryNode } from "./memory-node";
import { getActionByCommand, splitOnFirstWordAndArguments } from "../libs/utils-to-lib";

export type UsageType = 'active' | 'passive' | 'transitional' | 'common';

const CARD_INTERACTIVE_ACTIONS_MAP = {
  PRINT_ANSWER: ['a'],
  BACK: ['u', 'b', 'back'],
  EDIT: ['e', 'edit'],
  EXIT: ['x', 'ч', 'exit'],
}


export class Card {
  _id: number;
  question: CardItem[] = [];
  answer: CardItem[] = [];
  parentNodes: number[] = [];
  used = 0;
  needed = 0;
  count = 0;
  reverseCount?: number;
  practiceCount: number;
  usageType: UsageType = 'common'

  constructor(_id: number, question: CardItem[], answer: CardItem[], parentNodes: number[],
              count: number, needed: number, used: number,
              others: {
                reverseCount: number,
                practiceCount: number,
                usageType: UsageType
              }) {
    this._id = _id;
    this.question = question;
    this.answer = answer;
    this.parentNodes = parentNodes;
    this.used = used;
    this.needed = needed;
    this.count = count;
    this.practiceCount = others.practiceCount ?? 0;
    if (others.reverseCount !== undefined) {
      this.reverseCount = others.reverseCount;
    }
    // if (others.practiceCount !== undefined) {
    //   this.practiceCount = others.practiceCount;
    // }
    if (others.usageType !== undefined) {
      this.usageType = others.usageType;
    }
  }

  static createFromObj(obj: any): Card {
    const question = obj.question.map((qObj: TextCardItem) => createCardItemFromObj(qObj));
    const answer = obj.answer.map((aObj: TextCardItem) => createCardItemFromObj(aObj));
    return new Card(obj._id, question, answer, obj.parentNodes, obj.count, obj.needed, obj.used, obj);
  }

  async getParentNodes(): Promise<MemoryNode[]> {
    return MEMORY_NODES_API_SERVICE.getItems(this.parentNodes);
  }

  update() {
    CARDS_API_SERVICE.updateItem(this);
  }

  increaseCount(): void {
    this.count += 1;
    this.update();
  }

  increasePracticeCount(): void {
    this.practiceCount += 1;
    this.update();
  }

  decreaseCount(): void {
    if (this.count > 0) {
      this.count -= 1;
    }
    this.update();
  }

  decreasePracticeCount(): void {
    if (this.practiceCount > 0) {
      this.practiceCount -= 1;
    }
    this.update();
  }

  getOneLineQuestion() {
    return this.question[0].getOneLineText();
  }

  printQuestion() {
    console.log(tab('Question: '));
    // if (some(this.question, item => item.type === CardItemEnum.IMAGE)) {
    //   const html = getCardItemsInHTML(this.question);
    //   await showHTMLInBrowser(html);

    // } else {
    this.question.forEach((cardItem: CardItem) => {
      cardItem.print()
    });
    // }
  }

  getQuestionHTML(): string {
    return this.question
      .map((cardItem: CardItem) => cardItem.getHTML())
      .reduce(newLineConcatStringReducer);
  }

  async printAnswer() {
    console.log(tab('Answer: '));
    // if (some(this.answer, item => item.type === CardItemEnum.IMAGE)) {
    //   const html = getCardItemsInHTML(this.answer);
    //   await showHTMLInBrowser(html);
    // }
    this.answer.forEach((cardItem: CardItem) => {
      cardItem.print();
    });
    console.log(); //TODO remove it 
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

  printPracticeStats(quizState: IQuizState | null) {
    if (quizState !== null) {
      const rightPart = this.practiceCount === quizState.originalCount
        ? `( ${this.practiceCount} )`
        : `(${quizState.originalCount} – ${this.practiceCount})`;
      console.log(`\n\t(${chalk.green(quizState.leftCardsNumber)}) – ${chalk.yellow(rightPart)}\n`);
      // console.log(`COUNT: ${this.count}\n`);
      // console.log(`ORIGINAL COUNT: ${quizState.originalCount}`);
    } else {
      console.log(`PRACTICE COUNT: ${this.practiceCount}\n`); // TODO look at this practice count variable
    }
  }


  save() {
    CARDS_API_SERVICE.updateItem(this);
  }

  async interactive(): Promise<void> {
    while (true) {
      console.clear();
      await this.print();
      const val = await getUserInput('Enter a next card command');
      const [command, args] = splitOnFirstWordAndArguments(val);
      const action = getActionByCommand(CARD_INTERACTIVE_ACTIONS_MAP, command);
      if (!action) {
        continue;
      }
      switch (action) {
        case "EDIT":
          const editedValue = await getInputFromEditor('Edit card value', {
            extension: 'json',
            originalContent: JSON.stringify(this, null, '\t')
          })
          console.log(editedValue);
          const updatedCard = Card.createFromObj(JSON.parse(editedValue));
          await CARDS_API_SERVICE.updateItem(updatedCard);
          this.updateInstance(updatedCard);
          await waitForUserInput();
          break;
        case "EXIT":
          exit();
          break;
        case "PRINT_ANSWER":
          await this.printAnswer();
          await waitForUserInput();
          break;
        case "BACK":
          return;
      }
    }

  }

  private async print() {
    const parent = (await this.getParentNodes())[0];
    await printParentsPath(parent);
    console.log(`Card ${this._id}`)
    await this.printQuestion();
  }

  private updateInstance(otherInstance: Card) {
    this.question = otherInstance.question;
    this.answer = otherInstance.answer;
    this.parentNodes = otherInstance.parentNodes;
    this.used = otherInstance.used;
    this.needed = otherInstance.needed;
    this.count = otherInstance.count;
    this.reverseCount = otherInstance.reverseCount;
    this.practiceCount = otherInstance.practiceCount;
    this.usageType = otherInstance.usageType;
  }
}
