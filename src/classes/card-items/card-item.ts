import { ImageCardItem } from "./image-card-item";
import { TextCardItem } from "./text-card-item";
import { TextWithHighlightedSymbolCardItem } from "./text-with-highlighted-symbol";


export function createCardItemFromObj(obj: CardItem): TextCardItem | TextWithHighlightedSymbolCardItem | ImageCardItem | null {
  if (obj.type === CardItemEnum.TEXT) {
    return TextCardItem.createFromObj(obj);
  }
  if (obj.type === CardItemEnum.TEXT_WITH_HIGHLIGHTED_SYMBOL) {
    return TextWithHighlightedSymbolCardItem.createFromObj(obj);
  }
  if (obj.type === CardItemEnum.IMAGE) {
    return ImageCardItem.createFromObj(obj);
  }

  return null;
}
export enum CardItemEnum {
  TEXT = 'TEXT',
  TEXT_WITH_HIGHLIGHTED_SYMBOL = 'TEXT_WITH_HIGHLIGHTED_SYMBOL',
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
  print(): void;
}
