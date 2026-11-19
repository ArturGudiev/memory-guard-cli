import chalk from "chalk";

export function printInColor(message: any, color: string, newline = true): void {
  const colored = chalk.hex(color)(message);
  if (newline) {
    console.log(colored);
  } else {
    process.stdout.write(colored);
  }
}

export function getStringWithHighlightedSymbols(message: string, indexesToColor: number[]): string {
  return message
    .split("")
    .map((char, index) => (indexesToColor.includes(index) ? chalk.red(char) : char))
    .join("");
}

export function printStringWithHighlightedSymbols(message: string, indexesToColor: number[]): void {
  console.log(getStringWithHighlightedSymbols(message, indexesToColor));
}
