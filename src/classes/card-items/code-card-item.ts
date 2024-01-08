import { tab } from "ag-utils-lib";
import { CardItem, CardItemEnum } from "./card-item";

export class CodeCardItem implements CardItem {
    type: CardItemEnum = CardItemEnum.CODE;
    code = ''
    extension = ''

    constructor(code: string, extension?: string) {
        this.code = code;
        if (extension) {
            this.extension = extension;
        }
    }

    getOneLineCardItemRepresentation(): string {
        return 'CODE \t ' + this.code.split('\n')[0];
    }
    getOneLineText(): string {
        return this.code.split('\n').filter(l => l !== '')[0];
    }
    getString(): string {
        return this.code;
    }

    print(): void {
        console.log(tab(this.getString(), 2));
    }

    getHTML(): string {
        throw new Error("Method not implemented.");
    }

}