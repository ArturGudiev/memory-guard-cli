import { Collection, Db, ObjectId } from "mongodb";
import { Meta } from "../cli/meta-api-cli.service";
import { firstValueFrom, from, map, of } from "rxjs";

export interface MetaMongoItem {
  _id: ObjectId,
  value: number,
  field: string;
}

export class MetaApiMongoService {

  get collection(): Collection<MetaMongoItem> {
    return this.db.collection<MetaMongoItem>(this.collectionName);
  }


  constructor (private db: Db, public collectionName: string) {
  }

  async getFieldValue(field: keyof Meta): Promise<any> {
    return firstValueFrom(
      from(this.collection.findOne({field})).pipe(map(el => el?.value))
    );

    // const doc = await this.collection.findOne({field});
    // if (!doc) {
    //   throw new Error(`Not found key ${field}`);
    // }
    // return doc?.value;
  }


  async incrementFieldValue(field: keyof Meta): Promise<any> {
    return this.collection.updateOne({field}, {$inc: {value: 1}});
  }


}
