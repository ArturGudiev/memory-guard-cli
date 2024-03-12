import { UUID } from "node:crypto";

export interface ApiService<T> {
  addItem(t: T): Promise<void>;
  getItem(id: number): Promise<T | null>;
  getItems(ids: number[]): Promise<T[]>;
  getAllItems(): Promise<T[]>;
  deleteItem(t: T): Promise<void>;
  updateItem(t: T): Promise<void>;
}

export interface ApiCliService<T> extends ApiService<T> {
  FILE_PATH: string;
  saveAllItems(arr: T[]): Promise<void>;
}

export interface ItemWithId<T = UUID> {
  _id: T;
}
