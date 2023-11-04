import readlineSync from 'readline-sync';
import {readFileSync, writeFileSync} from 'fs';

export async function getUserInput(message: string, colon = true) {
  message = message + (colon ? ':' : '') + ' ';
  return readlineSync.question(message);
}


export async function waitForUserInput(message = 'Press enter') {
  await getUserInput(message);
}

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

export function exit() {
  process.exit(1);
}

export function writeFileContent(path: string, content: any): void {
  writeFileSync(path, JSON.stringify(content, null, '\t'));
}

export function getJSONFileContent(path: string): any {
  const content = readFileSync(path);
  return JSON.parse(content.toString());
}
