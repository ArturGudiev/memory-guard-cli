import { PracticeItem } from "../classes/practice-item";
import { UUID } from "crypto";

export interface IPracticeItemsService {
  getPracticeItemByCardId(cardId: number): PracticeItem | null;
  getPracticeItemById(id: UUID): PracticeItem;
  savePracticeItem(item: PracticeItem): PracticeItem;    
  createPracticeItemForCard(cardId: number): PracticeItem;
  addPracticeItem(item: PracticeItem): void;
}

