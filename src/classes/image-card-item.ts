import {getUserInput} from "ag-utils-lib";
import {showImageInBrowser} from "../libs/utils/browser.utils";
import {CardItem, CardItemEnum} from "./card-item";

export class ImageCardItem implements CardItem {
  readonly type = CardItemEnum.IMAGE;
  width: string | undefined;
  imagePath: string;

  constructor(imagePath: string, width?: string) {
    this.imagePath = imagePath;
    if (width) {
      this.width = width;
    }
  }

  getOneLineCardItemRepresentation(): string {
    return 'Image ' + this.imagePath;
    // throw new Error("Method not implemented.");
  }

  getOneLineText(): string {
    // throw new Error("Method not implemented.");
    return 'Image ' + this.imagePath;
  }

  getString(): string {
    return 'Image ' + this.imagePath;
  }

  getHTML(): string {
    return `<img src="file:///${this.imagePath}" ${this.width ? 'width="' + this.width + '"' : ''}>`;
  }

  static createFromObj(obj: any) {
    const width = obj.width;
    if (width) {
      return new ImageCardItem(obj.imagePath, width);
    } else {
      return new ImageCardItem(obj.imagePath);
    }
  }

  static async createInteractively(): Promise<ImageCardItem | null> {
    try {
      const path = await getUserInput('Enter image\'s path');
      let width: string;
      width = await getUserInput('Enter image width');
      const checkWidthInBrowser = await getUserInput('Check width in browser');
      if (checkWidthInBrowser === 'y') {
        while (true) {
          await showImageInBrowser(path, width);
          const nextCommand = await getUserInput('Enter next width or run x');
          if (nextCommand === 'x') {
            break;
          } else {
            width = nextCommand;
          }
        }
      }
      if (checkWidthInBrowser) {
      }
      if (path === '') {
        return null;
      }
      return new ImageCardItem(path, width);
    } catch (e){
      return null;
    }
  }

}
