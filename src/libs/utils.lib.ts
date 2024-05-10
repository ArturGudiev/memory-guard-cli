import {getUserInput, getUserInputUnicode, removeFirstArgument} from "ag-utils-lib";
import { CONFIGURATION } from "../config";


export function isInRange(numberToCheck: number, leftBorderType: '[' | '(', leftBorderNumber: number,
                          rightBorderNumber: number, rightBorderType: ']' | ')') {
  const leftCondition = leftBorderType === '['
    ? numberToCheck >= leftBorderNumber
    : numberToCheck > leftBorderNumber;
  const rightCondition = rightBorderType === ']'
    ? numberToCheck <= rightBorderNumber
    : numberToCheck < rightBorderNumber;
  return leftCondition && rightCondition;
}

export function removeFirstWord(line: string): string {
  const words = line.split(' ');
  const wordsWithoutFirstOne = removeFirstArgument(words);
  return wordsWithoutFirstOne.join(' ');
}

export function isEmptyString(str: string): boolean {
  return /^\s*$/.test(str);
}

export function fMap<T, K extends keyof T>(arr: T[], field: K): Array<T[K]>{
  return arr.map((el: T) => el[field]);
}


export function concatStringsWithNewLines(arrayOfStrings: string[]){
  return arrayOfStrings.reduce(newLineConcatStringReducer)
}

export const newLineConcatStringReducer = (x: string, y: string) => x + '\n' + y;

export function isNullOrUndefined(val: unknown): boolean {
  return val === undefined || val === null;
}

export async function getInput(message: string): Promise<string> {
  const isUnicode = CONFIGURATION.useUnicodeInput;
  if (isUnicode) {
    return await getUserInputUnicode(message);
  } else {
    return await getUserInput(message);
  }
}

// TODO finish it
// function definedField(fieldName: string) {
//   return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     descriptor.get(fieldName);
//   };
// }
