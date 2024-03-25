import { newline, removeFirstArgument } from "ag-utils-lib";
import { printInColor } from "../ts-utils/chalk.utils";

export function splitOnFirstWordAndArguments(val: string): [string, string[]] {
  const args = val.split(' ');
  return [args[0], removeFirstArgument(args)];
}


export function getActionByCommand<T extends { [key: string]: string | string[] }>(actionsMap: T, command: string): keyof T | "EMPTY" | null {
  //Object.entries(actionsMap).forEach(([key, val]) => {
  if (command === '') {
    return "EMPTY";
  }
  for ( const [key, val] of Object.entries(actionsMap) ) {
    if (Array.isArray(val)) {
      if (val.includes(command)) {
        return key;
      }
    } else {
      if (val === command) {
        return key;
      }
    }
  }
  return null;
}




export function printList(title: string, items: string[], color?: string): void {
  if (items.length === 0) {
    return;
  }
  console.log(`\t------${title}------`);
  newline();
  items.forEach((el, index) => {
    if (!color) {
      console.log(`\t ${index + 1}. ${el}`);
    } else {
      printInColor(`\t ${index + 1}. ${el}`, color)
    }

  });
  newline();
}

export function printObjectsList<T>(title: string, items: T[], convertFunction: (el: T) => string, color?: string): void {
  printList(title, items.map(el => convertFunction(el)), color);
}

export function printNamedObjectsList<T extends {name: string}>(title: string, items: T[], color?: string): void {
  printList(title, items.map(el => el.name), color);
}
