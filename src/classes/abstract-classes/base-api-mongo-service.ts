import { ApiService, ItemWithId } from "../../interfaces/service-interfaces";
import { Collection, Db, OptionalUnlessRequiredId } from "mongodb";

export abstract class BaseApiMongoService<T extends ItemWithId<U>, U = number> implements ApiService<T, U> {

  get collection(): Collection<T> {
    return this.db.collection<T>(this.collectionName);
  }

  constructor(private db: Db, public collectionName: string) { }

  abstract createFromObj(obj: any): T;

  async getItem(id: U): Promise<T | null> {
    const res = await this.collection.findOne({_id: id} as any);
    if (!res) {
      return null;
    }
    return this.createFromObj(res);
  }

  async getItems(ids: U[]): Promise<T[]> {
    const arr = await this.collection.find({_id: {$in: ids} as any}).toArray();
    return arr.map(el => this.createFromObj(el));
  }

  async getAllItems(): Promise<T[]> {
    const arr = await this.collection.find().toArray();
    return arr.map(el => this.createFromObj(el));
  }

  async deleteItem(t: T): Promise<void> {
    await this.collection.deleteOne({_id: t._id} as any);
  }

  async updateItem(t: T): Promise<void> {
    await this.collection.updateOne({_id: t._id} as any, {$set: t});
  }

  async addItem(t: T): Promise<void> {
    await this.collection.insertOne(t as OptionalUnlessRequiredId<T>);
  }

}
