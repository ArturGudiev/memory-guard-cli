import { writeFileSync } from "node:fs";
import { getJSONFileContent } from "ag-utils-lib";
import { ApiCliService, ItemWithId } from "../../interfaces/service-interfaces";

export abstract class BaseApiCliService<T extends ItemWithId<number>> implements ApiCliService<T> {

  constructor(public FILE_PATH: string) {
    this.FILE_PATH = FILE_PATH;
  }

  abstract createFromObj(obj: any): T;

  async addItem(t: T): Promise<void> {
    const arr = await this.getAllItems();
    arr.push(t);
    this.saveAllItems(arr);
  }

  async getItem(id: number): Promise<T | null> {
    const items: T[] = await this.getAllItems();
    const item = items.find(el => el._id === id);
    return this.createFromObj(item) ?? null;
  }

  async getItems(ids: number[]): Promise<T[]> {
    const items: T[] = await this.getAllItems();
    return items.filter(el => ids.includes(el._id)).map(el => this.createFromObj(el));
  }

  async updateItem(t: T): Promise<void> {
    const arr = await this.getAllItems();
    const index = arr.findIndex((el: T) => el._id === t._id);
    if (index >= 0) {
      arr[index] = t;
      this.saveAllItems(arr);
    }
  }

  async deleteItem(t: T): Promise<void> {
    const arr = await this.getAllItems();
    const index = arr.findIndex((el: T) => el._id === t._id);
    if (index >= 0) {
      arr.splice(index, 1);
      this.saveAllItems(arr);
    }
  }

  async saveAllItems(arr: T[]): Promise<void> {
    writeFileSync(this.FILE_PATH, JSON.stringify(arr, null, '\t'));
  }

  getAllItems(): Promise<T[]> {
    return getJSONFileContent(this.FILE_PATH).map((el: any) => this.createFromObj(el));
  }

}
