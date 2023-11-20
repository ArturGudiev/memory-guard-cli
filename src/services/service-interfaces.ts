import {MemoryNode} from "../classes/memory-node";
import {Card} from "../classes/card";
import {CardItem, TextCardItem} from "../classes/card-item";
import {MEMORY_NODES_SERVICE} from "./contianer";

export interface IMemoryNodesService {

  addMemoryNode(node: MemoryNode): void;
  addNewMemoryNodeWithNameAndParents(name: string, parents: MemoryNode[]): void;
  getAllMemoryNodes(): MemoryNode[];
  getMemoryNodeById(_id: number): MemoryNode | null;
  getMemoryNodesByIDs(ids: number[]): MemoryNode[];
  updateMemoryNode(nodeToSave: MemoryNode): void;
  deleteMemoryNode(memoryNode: MemoryNode): void;
  nodeExists(id: number): boolean;
}

export interface ICardsService {
  addCard(card: Card): void;
  addNewCardHandler(name: string, parents: Card[]): void;
  getAllCards(): Card[];
  getCardById(_id: number): Card | null;
  getCardsByIDs(ids: number[]): Card[];
  updateCard(nodeToSave: Card): void;
  deleteCard(card: Card): void;
  createInteractively(node: MemoryNode): Promise<Card | null>;
  createFromText(question: string, answer: string, parentNode: number): Card | null;
}

