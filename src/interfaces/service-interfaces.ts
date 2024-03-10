import {UUID} from "node:crypto";
import {writeFileSync} from "node:fs";
import {getJSONFileContent} from "ag-utils-lib";

export interface ApiService<T> {
  addItem(t: T): void;
  getItemById(id: number): T | null;
  getItemByIds(id: number[]): T[];
  getAllItems(): T[];
  deleteItem(t: T): void;
  updateItem(t: T): void;
}

export interface ApiCliService<T> extends ApiService<T> {
  FILE_PATH: string;
  saveAllItems(arr: T[]): void;
}

export abstract class BaseApiCliService<T extends ItemWithId<number>> implements ApiCliService<T> {

  constructor(public FILE_PATH: string) {
    this.FILE_PATH = FILE_PATH;
  }

  abstract createFromObj(obj: any): T;

  addItem(t: T): void {
    const arr = this.getAllItems();
    arr.push(t);
    this.saveAllItems(arr);
  }

  getItemById(id: number): T | null {
    const items: T[] = this.getAllItems();
    const item = items.find(el => el._id === id);
    return this.createFromObj(item) ?? null;
  }

  getItemByIds(ids: number[]): T[] {
    const items: T[] = this.getAllItems();
    return items.filter(el => ids.includes(el._id)).map(el => this.createFromObj(el));
  }

  updateItem(t: T): void {
    const arr = this.getAllItems();
    const index = arr.findIndex((el: T) => el._id === t._id);
    if (index >= 0) {
      arr[index] = t;
      this.saveAllItems(arr);
    }
  }

  deleteItem(t: T): void {
    const arr = this.getAllItems();
    const index = arr.findIndex((el: T) => el._id === t._id);
    if (index >= 0) {
      arr.splice(index, 1);
      this.saveAllItems(arr);
    }
  }

  saveAllItems(arr: T[]): void {
    writeFileSync(this.FILE_PATH, JSON.stringify(arr, null, '\t'));
  }

  getAllItems(): T[] {
    return getJSONFileContent(this.FILE_PATH).map((el: any) => this.createFromObj(el));
  }

}

export interface ItemWithId<T = UUID> {
  _id: T;
}
