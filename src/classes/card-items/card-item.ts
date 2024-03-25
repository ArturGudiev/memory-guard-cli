import { ImageCardItem } from "./image-card-item";
import { TextCardItem } from "./text-card-item";
import { TextWithHighlightedSymbolCardItem } from "./text-with-highlighted-symbol";
import { CodeCardItem } from "./code-card-item";
import { FormulaCardItem } from "./formula-card-item";

export type CardItemsType =
  TextCardItem
  | TextWithHighlightedSymbolCardItem
  | ImageCardItem
  | CodeCardItem
  | FormulaCardItem;

export function createCardItemFromObj(obj: CardItem): CardItemsType | null {
  if (obj.type === CardItemEnum.TEXT) {
    return TextCardItem.createFromObj(obj);
  }
  if (obj.type === CardItemEnum.TEXT_WITH_HIGHLIGHTED_SYMBOL) {
    return TextWithHighlightedSymbolCardItem.createFromObj(obj);
  }
  if (obj.type === CardItemEnum.IMAGE) {
    return ImageCardItem.createFromObj(obj);
  }
  if (obj.type === CardItemEnum.CODE) {
    return CodeCardItem.createFromObj(obj);
  }
  if (obj.type === CardItemEnum.FORMULA) {
    return FormulaCardItem.createFromObj(obj);
  }

  return null;
}

export enum CardItemEnum {
  TEXT = 'TEXT',
  TEXT_WITH_HIGHLIGHTED_SYMBOL = 'TEXT_WITH_HIGHLIGHTED_SYMBOL',
  CODE = 'CODE',
  IMAGE = 'IMAGE',
  FORMULA = 'FORMULA',
  WORD_WITH_STRESS = 'WORD_WITH_STRESS'
}

export interface CardItem {
  readonly type: CardItemEnum;

  getOneLineCardItemRepresentation(): string;

  getOneLineText(): string;

  getString(): string;

  getHTML(): string;

  print(): void;
}
