import { BaseApiMongoService } from "../../../classes/abstract-classes/base-api-mongo-service";
import { MemoryNode, PracticeItem } from "../../../classes";

export class PracticeItemsApiMongoService extends BaseApiMongoService<PracticeItem, string> {

  async getPracticeItemByCardId(cardId: number): Promise<PracticeItem | null> {
    const res = await this.collection.findOne({ cardId } as any);
    if (!res) {
      return null;
    }
    return PracticeItem.createFromObj(res) ?? null;
  }


  createFromObj(obj: any): PracticeItem {
    return PracticeItem.createFromObj(obj);
  }

}
