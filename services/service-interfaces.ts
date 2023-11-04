import {MemoryNode} from "../classes/memory-node";
import {Card} from "../classes/card";

export interface IMemoryNodesService {

  addMemoryNode(node: MemoryNode): void;
  addNewMemoryNodeWithNameAndParents(name: string, parents: MemoryNode[]): void;
  getAllMemoryNodes(): MemoryNode[];
  getMemoryNodeById(_id: number): MemoryNode | null;
  getMemoryNodesByIDs(ids: number[]): MemoryNode[];
  updateMemoryNode(nodeToSave: MemoryNode): void;
  deleteMemoryNode(memoryNode: MemoryNode): void;
}

export interface ICardsService {
  addCard(node: Card): void;
  addNewCardHandler(name: string, parents: Card[]): void;
  getAllCards(): Card[];
  getCardById(_id: number): Card | null;
  getCardsByIDs(ids: number[]): Card[];
  updateCard(nodeToSave: Card): void;
  deleteCard(card: Card): void;
}

