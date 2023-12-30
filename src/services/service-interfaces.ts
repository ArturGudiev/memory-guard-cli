import {MemoryNode} from "../classes/memory-node";
import {Card} from "../classes/card";
import {CardItem} from "../classes/card-item";

export interface IMemoryNodesService {

  addMemoryNode(node: MemoryNode): void;
  addNewMemoryNodeWithNameAndParents(name: string, parents: MemoryNode[]): void;
  getAllMemoryNodes(): MemoryNode[];
  getMemoryNodeById(_id: number): MemoryNode | null;
  getMemoryNodesByIDs(ids: number[]): MemoryNode[];
  updateMemoryNode(nodeToSave: MemoryNode): void;
  deleteMemoryNode(memoryNode: MemoryNode): void;
  nodeExists(id: number): boolean;
  isAliasUsed(aliasToCheck: string): boolean;
  getMemoryNodeByAlias(alias: string): MemoryNode | null;
}

export interface ICardsService {
  addCard(card: Card): void;
  addNewCardHandler(name: string, parents: Card[]): void;
  getAllCards(): Card[];
  saveAllCards?(card: Card[]): void;
  getCardById(_id: number): Card | null;
  getCardsByIDs(ids: number[]): Card[];
  updateCard(nodeToSave: Card): void;
  deleteCard(card: Card): void;
  createInteractively(node: MemoryNode, options: any): Promise<Card | null>;
  createCardByQuestionAndAnswer(node: MemoryNode,
                                questionArray: CardItem[],
                                answerArray: CardItem[],
                                options: any): Card;
  createFromText(question: string, answer: string, parentNode: number): Card | null;
}

