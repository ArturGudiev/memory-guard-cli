import { CARDS_API_SERVICE, MEMORY_NODES_API_SERVICE, MEMORY_NODES_SERVICE, META_SERVICE } from "./contianer";
import { fillCardItemsArray } from "../libs/cards.lib";
import { Card, CardItem, MemoryNode, TextCardItem } from "../classes";

export class CardsService {
  // addItem(card: Card): void {
  //   const cards = this.getAllItems();
  //   cards.push(card);
  //   this.saveAllItems(cards);
  // }

  // getAllItems(): Card[] {
  //   const cards: any[] = getJSONFileContent(CARDS_FILE_NAME);
  //   return cards.map((node: any) => Card.createFromObj(node));
  // }

  // getItem(_id: number): Card | null {
  //   const nodes: any[] = getJSONFileContent(CARDS_FILE_NAME);
  //   const nodeObj = nodes.find(node => node._id === _id);
  //   return nodeObj ? Card.createFromObj(nodeObj) : null;
  // }
  //
  // getItems(ids: number[]): Card[] {
  //   let arr = getJSONFileContent(CARDS_FILE_NAME);
  //   arr = arr
  //     .filter((node: Card) => ids.includes(node._id))
  //     .map((nodeObj: Card) =>
  //       Card.createFromObj(nodeObj));
  //   // return setOrder(arr, ids);
  //   return arr;
  // }

  // updateItem(nodeToSave: Card): void {
  //   const nodes: any[] = getJSONFileContent(CARDS_FILE_NAME);
  //   const index = nodes.findIndex((node: any) => node._id === nodeToSave._id);
  //   nodes[index] = nodeToSave;
  //   this.saveAllItems(nodes);
  // }

  async deleteCardHandler(card: Card): Promise<void> {
    // const tasks = this.getAllItems();
    // // move to trash
    // const index = tasks.findIndex((t: Card) => t._id === card._id);
    //
    // // filter tasks
    // tasks.splice(index, 1);
    // this.saveAllItems(tasks);
    await CARDS_API_SERVICE.deleteItem(card);

    const parentNodes = await card.getParentNodes();
    for (let parent of parentNodes) {
      parent.children = parent.children.filter((id: number) => id !== card._id);
      await parent.save();
    }
  }

  async getMemoryNodeCardsByMemoryNodeId(id: number): Promise<Card[]> {
    const node = await MEMORY_NODES_API_SERVICE.getItem(id);
    if (!node) {
      return [];
    }
    return CARDS_API_SERVICE.getItems(node.cards);
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
    return new Card(META_SERVICE.getNextCardId(), questionArray, answerArray, [parentNode._id], 0, 0, 0,
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
    return new Card(META_SERVICE.getNextCardId(), questionArray, answerArray, [parentNode._id], 0, 0, 0,
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
  async createFromText(question: string, answer: string, parentNode: number): Promise<Card | null> {
    const questionArray: CardItem[] = [new TextCardItem(question)];
    const answerArray: CardItem[] = [new TextCardItem(answer)];
    if ( await MEMORY_NODES_SERVICE.nodeExists(parentNode) ) {
      return new Card(META_SERVICE.getNextCardId(), questionArray, answerArray, [parentNode], 0, 0, 0,
        {
          reverseCount: 0,
          practiceCount: 0,
          usageType: 'common'
        });
    }
    return null;
  }

  // saveAllItems(cards: Card[]) {
  //   writeFileSync(CARDS_FILE_NAME, JSON.stringify(cards, null, '\t'));
  // }
}
