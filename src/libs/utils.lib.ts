import { removeFirstArgument } from "ag-utils-lib";


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
