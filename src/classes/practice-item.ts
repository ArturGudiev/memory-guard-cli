export class PracticeItem {
    cardId: number;
    baseExamples: string[];
    examples: string[];

    constructor(
        cardId: number,
        baseExamples: string[],
        examples: string[]
    ) {
        this.cardId = cardId;
        this.baseExamples = baseExamples ?? [];
        this.examples = examples ?? [];
    }


    createFromObj(obj: any): PracticeItem {
        return new PracticeItem(obj.cardId, obj.baseExamples, obj.examples);
    }
}