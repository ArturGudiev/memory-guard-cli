import { CardItem, CardItemEnum } from "./card-item";
import { getInputFromEditor, getUserInput, tab } from "ag-utils-lib";

export class FormulaCardItem implements CardItem {
  readonly type = CardItemEnum.FORMULA;
  formula: string;

  constructor(formula: string) {
    this.formula = formula;
  }

  getHTML(): string {
    return "";
  }

  getOneLineCardItemRepresentation(): string {
    return "Formula \t" + this.formula.split('\n')[0];
  }

  getOneLineText(): string {
    return this.formula.split('\n').filter(l => l !== '')[0];
  }

  getString(): string {
    return this.formula;
  }

  print(): void {
    console.log(tab(this.getString(), 2));
  }

  static async createInteractively() {
    try {
      const formula = await getInputFromEditor('Enter formula', { extension: '.latex'});
      return new FormulaCardItem(formula);
    } catch (e){
      return null;
    }
  }

  static createFromObj(obj: any): FormulaCardItem {
    return new FormulaCardItem(obj.formula);

  }

}
