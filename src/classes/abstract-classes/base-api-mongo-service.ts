import { ApiService, ItemWithId } from "../../interfaces/service-interfaces";
import { Collection, Db } from "mongodb";

export abstract class BaseApiMongoService<T extends ItemWithId<number>> implements ApiService<T> {

  get collection(): Collection<T> {
    return this.db.collection<T>(this.collectionName);
  }
  constructor(private db: Db, public collectionName: string) {
  }

  abstract createFromObj(obj: any): T;

  async addItem(t: T): Promise<void> {
    const arr = await this.getAllItems();
    arr.push(t);
    // this.saveAllItems(arr);
  }

  async getItemById(id: number): Promise<T | null> {
    const items: T[] = await this.getAllItems();
    const item = items.find(el => el._id === id);
    return this.createFromObj(item) ?? null;
  }

  async getItemByIds(ids: number[]): Promise<T[]> {
    const items: T[] = await this.getAllItems();
    return items.filter(el => ids.includes(el._id)).map(el => this.createFromObj(el));
  }

  async updateItem(t: T): Promise<void> {
    const arr = await this.getAllItems();
    const index = arr.findIndex((el: T) => el._id === t._id);
    if (index >= 0) {
      arr[index] = t;
      // this.saveAllItems(arr);
    }
  }

  async deleteItem(t: T): Promise<void> {
    const arr = await this.getAllItems();
    const index = arr.findIndex((el: T) => el._id === t._id);
    if (index >= 0) {
      arr.splice(index, 1);
      // this.saveAllItems(arr);
    }
  }

  // async saveAllItems(arr: T[]): void {
  //   writeFileSync(this.FILE_PATH, JSON.stringify(arr, null, '\t'));
  // }

  async getAllItems(): Promise<T[]> {
    // return getJSONFileContent(this.FILE_PATH).map((el: any) => this.createFromObj(el));
    return [];
  }

}
