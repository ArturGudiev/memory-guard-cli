import {ICardsService} from "./service-interfaces";
import {Card} from "../classes/card";
import {getJSONFileContent, writeFileContent} from "../libs/utils.lib";
import {CARDS_FILE_NAME, MEMORY_NODES_FILE_NAME, META_FILE} from "../libs/memory-nodes.lib";
import {writeFileSync} from "fs";

export class CardsService implements ICardsService {
  addCard(node: Card): void {
    const cards = this.getAllCards();
    cards.push(node);
    this.saveAllCards(cards);
  }

  getAllCards(): Card[] {
    const cards: any[] = getJSONFileContent(CARDS_FILE_NAME);
    return cards.map((node: any) => Card.createFromObj(node));
  }

  getCardById(_id: number): Card | null {
    const nodes: any[] = getJSONFileContent(CARDS_FILE_NAME);
    const nodeObj = nodes.find(node => node._id === _id);
    return nodeObj ? Card.createFromObj(nodeObj) : null;
  }


  getCardsByIDs(ids: number[]): Card[] {
    let arr = getJSONFileContent(CARDS_FILE_NAME);
    arr = arr
      .filter((node: Card) => ids.includes(node._id))
      .map((nodeObj: Card) =>
        Card.createFromObj(nodeObj));
    // return setOrder(arr, ids);
    return arr;
  }

  updateCard(nodeToSave: Card): void {
    const nodes: any[] = getJSONFileContent(CARDS_FILE_NAME);
    const index = nodes.findIndex((node: any) => node._id === nodeToSave._id);
    nodes[index] = nodeToSave;
    this.saveAllCards(nodes);
  }

  deleteCard(card: Card): void {
    const tasks = this.getAllCards();
    // move to trash
    const index = tasks.findIndex((t: Card) => t._id === card._id);

    // filter tasks
    tasks.splice(index, 1);
    this.saveAllCards(tasks);

    for (let parent of card.getParentNodes()) {
      parent.children = parent.children.filter(id => id !== card._id);
      parent.save();
    }
  }

  /**
   *
   * @param name
   * @param parents
   */
  addNewCardHandler(name: string, parents: Card[]): void {
    // const newCardId = this.getNextCardId();
    // const newNode = new Card(newCardId, name, [],
    //   parents.map(p => p._id), []);
    // this.addCard(newNode);
    // parents[0].children.push(newCardId);
    // parents[0].save();
  }

  getNextCardId(): number {
    const meta = getJSONFileContent(META_FILE);
    const id = ++meta.cardId;
    writeFileContent(META_FILE, meta);
    return id;
  }

  private saveAllCards(cards: Card[]) {
    writeFileSync(CARDS_FILE_NAME, JSON.stringify(cards, null, '\t'));
  }
}
