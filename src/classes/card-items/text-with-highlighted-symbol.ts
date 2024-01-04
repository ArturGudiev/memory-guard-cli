import {CardItem, CardItemEnum} from "./card-item";
import {getInputFromEditor, getUserInputUnicode} from "ag-utils-lib";
import {selectSymbolInString} from "../../main";
import {getStringWithHighlightedSymbols} from "../../ts-utils/chalk.utils";

export class TextWithHighlightedSymbolCardItem implements CardItem {
  readonly type: CardItemEnum = CardItemEnum.TEXT_WITH_HIGHLIGHTED_SYMBOL;
  text: string = '';
  index: number;

  constructor(text: string, index: number) {
    this.text = text;
    this.index = index;
  }

  getHTML(): string {
    return 'TEXT \t ' + this.text.split('\n')[0];
  }

  getOneLineCardItemRepresentation(): string {
    return 'TEXT with highlight \t ' + this.text.split('\n')[0];
  }

  getOneLineText(): string {
    return this.text.split('\n')[0];
  }

  getString(): string {
    return getStringWithHighlightedSymbols(this.text, [this.index]);
  }

  static createFromObj(obj: any) {
    return new TextWithHighlightedSymbolCardItem(obj.text, obj.index);
  }

  static async createInteractively(useEditor = false): Promise<TextWithHighlightedSymbolCardItem | null> {
    try {
      let text: string;
      if (useEditor) {
        text = await getInputFromEditor('Enter text item');
      } else {
        text = await getUserInputUnicode('Enter card item\'s text');
      }
      if (text === '') {
        return null;
      }
      const index = await selectSymbolInString(text);
      if (index !== null) {
        return new TextWithHighlightedSymbolCardItem(text, index);
      }
      return null;
    } catch (e){
      return null;
    }
  }

}
