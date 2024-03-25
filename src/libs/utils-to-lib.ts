import { removeFirstArgument } from "ag-utils-lib";

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
