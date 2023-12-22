import { getInputFromEditor, getUserInput, waitForUserInput } from "ag-utils-lib";
import { newLineConcatStringReducer } from "../libs/utils.lib";
import {htmlNewLine, showImageInBrowser} from "../libs/utils/browser.utils";
import {TextCardItem} from "./text-card-item";
import {ImageCardItem} from "./image-card-item";


export function createCardItemFromObj(obj: CardItem): TextCardItem | ImageCardItem | null {
  if (obj.type === CardItemEnum.TEXT) {
    return TextCardItem.createFromObj(obj);
  }
  if (obj.type === CardItemEnum.IMAGE) {
    return ImageCardItem.createFromObj(obj);
  }

  return null;
}
export enum CardItemEnum {
  TEXT = 'TEXT',
  TEXT_WITH_HIGHLIGHTED_SYMBOLS = 'TEXT_WITH_HIGHLIGHTED_SYMBOLS',
  CODE = 'CODE',
  IMAGE = 'IMAGE',
  WORD_WITH_STRESS = 'WORD_WITH_STRESS'
}

export interface CardItem {
  readonly type: CardItemEnum;
  getOneLineCardItemRepresentation(): string;
  getOneLineText(): string;
  getString(): string;
  getHTML(): string;
}
