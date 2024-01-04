import { getUserInput, waitForUserInput } from "ag-utils-lib";
import chalk from "chalk";
import { Subject } from "rxjs";
import { getRandomInt } from "./random.lib";
import { printStringWithHighlightedSymbols } from "../../ts-utils/chalk.utils";
import { reactOnKeysPressed } from "../interaction.lib";


export async function selectSymbolInString(text: string): Promise<number | null> {
  if (!text) {
    return null;
  }
  let symbolToSelect = 0;
  while (true) {
    console.clear();
    printStringWithHighlightedSymbols(text, [symbolToSelect]);
    const exitSubject = new Subject<void>();
    let exitLoop = false;
    await reactOnKeysPressed(
      {
        '2': async () => {
          if (symbolToSelect < text.length) {
            symbolToSelect += 1;
          }
          exitSubject.next();
        },
        '1': () => {
          if (symbolToSelect > 0) {
            symbolToSelect -= 1;
          }
          exitSubject.next();
        },
        'x': () => {
          exitSubject.next();
          exitLoop = true;
        },
        'ч': () => {
          exitSubject.next();
          exitLoop = true;
        }
      },
      [],
      exitSubject
    );
    if (exitLoop) {
      return symbolToSelect;
    }
    // await waitForUserInput();
  }

}export async function f() {

  const greeting = 'Hello Lera';
  // Specify the desired background color (hex format)
  const backgroundColor = '#FF5733'; // Change this to your preferred color


  // Set the background color using ANSI escape codes
  console.log(chalk.bgHex(backgroundColor).white('Hello, world!'));
  while (true) {

    console.clear();
    const number1 = getRandomInt(1, 4);
    const number2 = getRandomInt(1, 4);
    console.log(chalk.bgHex(backgroundColor).white('Hello, world!'));
    console.log(greeting);
    console.log(`${number1} + ${number2} =`);
    const sum = await getUserInput('Lera, Enter sum');
    if (+sum === number1 + number2) {
      console.log('\nCorrect\n');
    } else {
      console.log('\nWrong\n');
    }
    await waitForUserInput();
  }
}

