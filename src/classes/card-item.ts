import {getUserInput} from "../libs/utils.lib";


export function createCardItemFromObj(obj: CardItem): TextCardItem | null {
  if (obj.type === CardItemEnum.TEXT) {
    return TextCardItem.createFromObj(obj);
  }
  return null;
}
export enum CardItemEnum {
  TEXT = 'TEXT',
  CODE = 'CODE',
  IMAGE = 'IMAGE',
  WORD_WITH_STRESS = 'WORD_WITH_STRESS'
}

export interface CardItem {
  readonly type: CardItemEnum;
  getOneLineCardItemRepresentation(): string;
  getOneLineText(): string;
  getString(): string;
}

export class TextCardItem implements CardItem {
  text: string = ''
  readonly type =  CardItemEnum.TEXT


  constructor(text: string) {
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

  static createFromObj(obj: any) {
    return new TextCardItem(obj.text);
  }

  static async createInteractively(): Promise<TextCardItem | null> {
    try {
      let text = await getUserInput('Enter card item\'s text');
      if (text === '') {
        return null;
      }
      return new TextCardItem(text);
    } catch (e){
      return null;
    }
  }

}
