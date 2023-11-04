import {CardItem, createCardItemFromObj, TextCardItem} from "./card-item";
import {MemoryNode} from "./memory-node";
import {MEMORY_NODES_SERVICE} from "../services/contianer";

export class Card {
  _id: number;
  question: CardItem[] = [];
  answer: CardItem[] = [];
  parentNodes: number[] = [];
  // why not separate name?
  // reverse
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

}
