import {newLineConcatStringReducer} from "../libs/utils.lib";
import {getInputFromEditor, getUserInput} from "ag-utils-lib";
import {CardItem, CardItemEnum} from "./card-item";

export class TextCardItem implements CardItem {
  text: string = ''
  readonly type =  CardItemEnum.TEXT


  constructor(text: string, width: string | null = null) {
    this.text = text;
  }

  getOneLineCardItemRepresentation(): string {
    return 'TEXT \t ' + this.text.split('\n')[0];
  }

  getOneLineText(): string {
    return this.text.split('\n')[0];
  }

  getString(): string {
    return this.text;
  }

  getHTML(): string {
    return this.text.split('\n')
      .map((textLine: string) => `<div>${textLine}</div>`)
      .reduce(newLineConcatStringReducer);
  }

  static createFromObj(obj: any) {
    return new TextCardItem(obj.text);
  }

  static async createInteractively(useEditor = false): Promise<TextCardItem | null> {
    try {
      let text: string;
      if (useEditor) {
        text = await getInputFromEditor('Enter text item');
      } else {
        text = await getUserInput('Enter card item\'s text');
      }
      if (text === '') {
        return null;
      }
      return new TextCardItem(text);
    } catch (e){
      return null;
    }
  }
}
