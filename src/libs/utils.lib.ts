import readlineSync from 'readline-sync';
import {readFileSync, writeFileSync} from 'fs';
import _ from "lodash";
import {exec} from "child_process";
import * as fs from "fs";

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

export function tab(str: string, num = 1) {
  return str.split('\n').map(line => `${'\t'.repeat(num)}${line}`).reduce((a, b) => `${a}\n${b}`, '');
}

export function removeFirstArgument(args: any[]) {
  const newArray = [...args];
  newArray.splice(0, 1);
  return newArray;
}

export function removeFirstWord(line: string): string {
  const words = line.split(' ');
  const wordsWithoutFirstOne = removeFirstArgument(words);
  return wordsWithoutFirstOne.join(' ');
}

export function isEmptyString(str: string): boolean {
  return /^\s*$/.test(str);
}

export function printWithoutNewLine(line: string): void {
  process.stdout.write(line);
}

// export const getRandomNumber() => {
//
// }
export function newline(n = 1): void {
  _.times(n, () => console.log())
}

export function fMap<T, K extends keyof T>(arr: T[], field: K): Array<T[K]>{
  return arr.map((el: T) => el[field]);
}

export async function getInputFromEditor(message = '', options: {
  extension?: string, originalContent?: string, filename?: string
} = {}): Promise<string> {
  if (message) {
    console.log(message);
  }
  console.log('Wait for the user input: ');
  const dir = 'C:\\Artur\\temp\\';
  const filename = (options.filename ? `${options.filename}-` : 'tmp-dashboard-') + getRandomString();
  let fullFilename = `${dir}${filename}`;
  if (options.extension) {
    fullFilename += options.extension.startsWith('.') ? options.extension : `.${options.extension}`;
  }
  if (options.originalContent) {
    writeFileSync(fullFilename, options.originalContent);
  }
  // execPowerShellCommand(`code ${fullFilename}`);
  openFileAtLastPosition(fullFilename);
  const res = await waitForFirstFileChanges(fullFilename, options.originalContent);
  deleteFile(fullFilename);
  return res;
}

export function getRandomString(n = 5) {
  return Math.random().toString(36).substr(2, n);
}

export function openFileAtLastPosition(filename: string) {
  // exec(`code -g ${filename}:$($(get-content ${filename}).Length):100`, {'shell':'powershell.exe'}, (error, stdout, stderr)=> {
  exec(`subl ${filename}:$($(get-content ${filename}).Length):100`, {'shell': 'powershell.exe'});
}

export async function waitForFirstFileChanges(filename: string, originalContent?: string): Promise<string> {
    let res;
    fs.watchFile(
        filename,
        {
            persistent: true,
            interval: 200,
        },
        () => { // curr: any, prev: any
            try {
                res = fs.readFileSync(filename, 'utf8');
                if (res !== undefined && res !== null && (!originalContent || res !== originalContent)) {
                    fs.unwatchFile(filename);
                }
            } catch (e) {
                // console.log('ERROR in waitForFirstFileChanges')
            }

        }
    );
    while (res === undefined || (originalContent && res === originalContent)) {
        await sleep(200);
    }
    return res;
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function deleteFile(path: string): void {
  if (fs.existsSync(path)) {
    try {
      fs.unlinkSync(path)
      // file removed
    } catch (err) {
      // console.error(err)
    }
  }
}
