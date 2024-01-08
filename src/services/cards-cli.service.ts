import {ICardsService} from "./service-interfaces";
import {Card} from "../classes/card";
import {CARDS_FILE_NAME, META_FILE} from "../libs/memory-nodes.lib";
import {writeFileSync} from "fs";
import {MemoryNode} from "../classes/memory-node";
import {CardItem} from "../classes/card-items/card-item";
import {MEMORY_NODES_SERVICE} from "./contianer";
import {fillCardItemsArray} from "../libs/cards.lib";
import {getJSONFileContent, writeFileContent} from "ag-utils-lib";
import {TextCardItem} from "../classes/card-items/text-card-item";

export class CardsCliService implements ICardsService {
  addCard(card: Card): void {
    const cards = this.getAllCards();
    cards.push(card);
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

  async createInteractively(parentNode: MemoryNode, options: any): Promise<Card | null> {
    const questionArray: CardItem[] = [];
    const answerArray: CardItem[] = [];
    const name = await TextCardItem.createInteractively(options.getQuestionTextInTerminal);
    if ( !name ) {
      return null;
    }
    questionArray.push(name);
    await fillCardItemsArray(questionArray, 'Question');
    await fillCardItemsArray(answerArray, 'Answer');
    return new Card(this.getNextCardId(), questionArray, answerArray, [parentNode._id], 0, 0, 0,
      {
        reverseCount: 0,
        practiceCount: 0,
        usageType: options.usageType ?? 'common'
      });
  }

  createCardByQuestionAndAnswer(
    parentNode: MemoryNode,
    questionArray: CardItem[],
    answerArray: CardItem[],
    options: any): Card {
    return new Card(this.getNextCardId(), questionArray, answerArray, [parentNode._id], 0, 0, 0,
      {
        reverseCount: 0,
        practiceCount: 0,
        usageType: options.usageType ?? 'common'
      });
  }

  /**
   *
   * @param question
   * @param answer
   * @param parentNode
   */
  createFromText(question: string, answer: string, parentNode: number): Card | null {
    const questionArray: CardItem[] = [new TextCardItem(question)];
    const answerArray: CardItem[] = [new TextCardItem(answer)];
    if ( MEMORY_NODES_SERVICE.nodeExists(parentNode) ) {
      return new Card(this.getNextCardId(), questionArray, answerArray, [parentNode], 0, 0, 0,
        {
          reverseCount: 0,
          practiceCount: 0,
          usageType: 'common'
        });
    }
    return null;
  }

  saveAllCards(cards: Card[]) {
    writeFileSync(CARDS_FILE_NAME, JSON.stringify(cards, null, '\t'));
  }
}
