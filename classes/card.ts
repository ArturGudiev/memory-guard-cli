import {CardItem, createCardItemFromObj, TextCardItem} from "./card-item";
import {getUserInput, waitForUserInput} from "../libs/utils.lib";
import {COLOR_BLUE, COLOR_LightPink, COLOR_SAPPHIRE_BLUE} from "../constants";
import chalk from "chalk";
import {MemoryNode} from "./memory-node";
import {MEMORY_NODES_SERVICE} from "../services/contianer";

function printCardItemsArray(cardItems: CardItem[], prefix = '') {
  console.log();
  console.log(`\t------ ${[prefix]} Card Items ------`);
  console.log();
  cardItems.forEach((item: CardItem) => {
    console.log(chalk.blue(`\t${item.getOneLineRepresentation()}`));
  });
  console.log();
}

async function fillCardItemsArray(cardItems: CardItem[], prefix = '') {
  while (true) {
    console.clear();
    printCardItemsArray(cardItems, prefix);
    const command = await getUserInput('Enter a question command');
    if (command === 't+') {
      const textItem = await TextCardItem.createInteractively();
      if (textItem !== null) {
        cardItems.push(textItem);
      }
    }
    if (command === 'x') {
      break;
    }
  }
}

export class Card {
  _id: number;
  question: CardItem[] = [];
  answer: CardItem[] = [];
  parentNodes: number[] = [];
  // why not separate name?
  // reverse
  constructor(_id: number, question: CardItem[], answer: CardItem[]) {
    this._id = _id;
    this.question = question;
    this.answer = answer;
  }

  static async createInteractively(): Promise<Card | null> {
    const questionArray: CardItem[] = [];
    const answerArray: CardItem[] = [];
    const name = await TextCardItem.createInteractively();
    if ( !name ) {
      return null;
    }
    questionArray.push(name);
    await fillCardItemsArray(questionArray, 'Question');
    await fillCardItemsArray(answerArray, 'Answer');
    return new Card(getNextCardId(), questionArray, answerArray);
  }

  static createFromObj(obj: any): Card {
    const question = obj.question.map((qObj: TextCardItem) => createCardItemFromObj(qObj));
    const answer = obj.question.map((aObj: TextCardItem) => createCardItemFromObj(aObj));
    return new Card(obj._id, question, answer);
  }

  getParentNodes(): MemoryNode[] {
    return MEMORY_NODES_SERVICE.getMemoryNodesByIDs(this.parentNodes);
  }

}


function getNextCardId(): number {
    throw new Error("Function not implemented.");
}

