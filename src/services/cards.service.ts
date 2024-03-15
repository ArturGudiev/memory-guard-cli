import { CARDS_API_SERVICE, MEMORY_NODES_API_SERVICE, MEMORY_NODES_SERVICE, META_SERVICE } from "./contianer";
import { fillCardItemsArray } from "../libs/cards.lib";
import { Card, CardItem, MemoryNode, TextCardItem } from "../classes";

export class CardsService {

  async deleteCardHandler(card: Card): Promise<void> {
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
    return new Card(await META_SERVICE.getNextCardId(), questionArray, answerArray, [parentNode._id], 0, 0, 0,
      {
        reverseCount: 0,
        practiceCount: 0,
        usageType: options.usageType ?? 'common'
      });
  }

  async createCardByQuestionAndAnswer(
    parentNode: MemoryNode,
    questionArray: CardItem[],
    answerArray: CardItem[],
    options: any): Promise<Card> {
    return new Card(await META_SERVICE.getNextCardId(), questionArray, answerArray, [parentNode._id], 0, 0, 0,
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
      return new Card(await META_SERVICE.getNextCardId(), questionArray, answerArray, [parentNode], 0, 0, 0,
        {
          reverseCount: 0,
          practiceCount: 0,
          usageType: 'common'
        });
    }
    return null;
  }
}
