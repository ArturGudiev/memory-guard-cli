import { waitForUserInput } from "ag-utils-lib";
import { PRACTICE_ITEMS_SERVICE } from "../services/contianer";

export class PracticeItem {
    readonly _id: string;
    cardId: number;
    baseExamples: string[];
    examples: string[];

    constructor(
        _id: string,
        cardId: number,
        baseExamples: string[],
        examples: string[]
    ) {
        this._id = _id;
        this.cardId = cardId;
        this.baseExamples = baseExamples ?? [];
        this.examples = examples ?? [];
    }

    
    save() {
        PRACTICE_ITEMS_SERVICE.savePracticeItem(this); // save or update 
    }

    static createFromObj(obj: any): PracticeItem {
        return new PracticeItem(obj._id, obj.cardId, obj.baseExamples, obj.examples);
    }
}