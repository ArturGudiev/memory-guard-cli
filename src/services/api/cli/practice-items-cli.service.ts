import { getJSONFileContent, writeJSONFileContent } from "ag-utils-lib";
import { PracticeItem } from "../../../classes/practice-item";
import { IPracticeItemsService } from "../../service-interfaces";
import { randomUUID, UUID } from "crypto";
import { PRACTICE_ITEMS_FILE } from "../../../constants/files.constant";

export class PracticeItemsCliService implements IPracticeItemsService {
    getPracticeItemByCardId(cardId: number): PracticeItem | null {
        const practiceItems = this.getAllPracticeItems();
        const item = practiceItems.find(el => el.cardId === cardId)
        return item ?? null;
    }

    createPracticeItemForCard(cardId: number): PracticeItem {
        const item = new PracticeItem(randomUUID(), cardId, [], []);
        this.addPracticeItem(item);
        return item;
    }

    addPracticeItem(item: PracticeItem): void {
        const items = this.getAllPracticeItems();
        items.push(item);
        this.saveAllPracticeItems(items);
    }

    getPracticeItemById(id: UUID): PracticeItem {
        const practiceItems = this.getAllPracticeItems();
        const item = practiceItems.find(el => el._id === id)
        if (!item) {
            throw new Error("Not Found");
        }
        return item;
    }
    
    savePracticeItem(item: PracticeItem): PracticeItem {
        const practiceItems = this.getAllPracticeItems();
        const index = practiceItems.findIndex(el => el._id === item._id)
        practiceItems[index] = item;
        this.saveAllPracticeItems(practiceItems);
        return item;
    }

    private getAllPracticeItems(): PracticeItem[] {
        return getJSONFileContent(PRACTICE_ITEMS_FILE).map((el: any) => PracticeItem.createFromObj(el));
    }

    private saveAllPracticeItems(items: PracticeItem[]): void {
        writeJSONFileContent(PRACTICE_ITEMS_FILE, items);
    }

}
