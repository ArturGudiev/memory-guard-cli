import {CardItem, createCardItemFromObj, TextCardItem} from "./card-item";
import {MemoryNode} from "./memory-node";
import {CARDS_SERVICE, MEMORY_NODES_SERVICE} from "../services/contianer";

export class Card {
  _id: number;
  question: CardItem[] = [];
  answer: CardItem[] = [];
  parentNodes: number[] = [];
  used = 0;
  needed = 0;
  count = 0;
  reverseCount?: number;

  constructor(_id: number, question: CardItem[], answer: CardItem[], parentNodes: number[]) {
    this._id = _id;
    this.question = question;
    this.answer = answer;
    this.parentNodes = parentNodes;
  }

  static createFromObj(obj: any): Card {
    const question = obj.question.map((qObj: TextCardItem) => createCardItemFromObj(qObj));
    const answer = obj.question.map((aObj: TextCardItem) => createCardItemFromObj(aObj));
    return new Card(obj._id, question, answer, obj.parentNodes);
  }

  getParentNodes(): MemoryNode[] {
    return MEMORY_NODES_SERVICE.getMemoryNodesByIDs(this.parentNodes);
  }

  update() {
    CARDS_SERVICE.updateCard(this);
  }

  printQuestion() {
    this.question.forEach((cardItem: CardItem) => {
      console.log(cardItem.getString());
    });
  }

  printStats() {
    console.log(`COUNT: ${this.count}\n`)
  }
}
