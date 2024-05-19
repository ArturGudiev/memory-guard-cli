import { PracticeItem } from "../../classes";
import { randomUUID } from "crypto";
import { PRACTICE_ITEMS_API_SERVICE } from "../contianer";

export class PracticeItemsService {

  async createPracticeItemForCard(cardId: number): Promise<PracticeItem> {
    const item = new PracticeItem(randomUUID(), cardId, [], []);
    await PRACTICE_ITEMS_API_SERVICE.addItem(item);
    return item;
  }

}
