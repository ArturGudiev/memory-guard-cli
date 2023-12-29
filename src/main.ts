import {ArgumentParser} from "argparse";
import {Card, UsageType} from "./classes/card";
import {addTextCardToNode, CARDS_FILE_NAME} from "./libs/memory-nodes.lib";
import {CARDS_SERVICE, MEMORY_NODES_SERVICE} from "./services/contianer";
import {exit, getJSONFileContent, getUserInput, sleep, tab, waitForUserInput} from "ag-utils-lib";
import chalk from "chalk";
import {psFocusOnApp, runPowerShellCommand} from "./libs/utils/powershell";
import {exec} from "child_process";
import {getStringWithHighlightedSymbols, printStringWithHighlightedSymbols} from "./ts-utils/chalk.utils";
import {bindCallback, Subject} from "rxjs";
import {reactOnKeysPressed} from "./libs/interaction.lib";
import readlineSync from "readline-sync";
import readline from "readline";
import {TextWithHighlightedSymbolCardItem} from "./classes/text-with-highlighted-symbol";
import {MemoryNodesCliService} from "./services/memory-nodes.service";

function setUsageTypeForAllCardsInNode(nodeId: number, usageType: UsageType) {
  const node = MEMORY_NODES_SERVICE.getMemoryNodeById(nodeId);
  if (node) {
    const cards = node.getCards();
    cards.forEach((card: Card) => {
      card.usageType = usageType;
      card.save();
    })
  }
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// // Example usage: Get a random integer between 1 (inclusive) and 10 (exclusive)
// let randomNumber = getRandomInt(1, 10);
// console.log(randomNumber);
//

export async function f() {

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
    if (+sum === number1 + number2 ) {
      console.log('\nCorrect\n');
    } else {
      console.log('\nWrong\n');
    }
    await waitForUserInput();
  }
}



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

}

export async function getUserInput2(message: string, colon = true) {
  message = message + (colon ? ':' : '') + ' ';
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  let wait = true;
  let answerToReturn = '';
  rl.question(message, (answer) => {
    answerToReturn = answer;
    wait = false;
    rl.close();
  });
  while (wait) {
    await sleep(200);
  }
  return answerToReturn;
}




async function temp() {
  // const cards: any[] = getJSONFileContent(CARDS_FILE_NAME);
  // return cards.map((node: any, index: number) => {
  //   console.log(node, index);
  //   return Card.createFromObj(node);
  // });
  // const card = CARDS_SERVICE.getCardById(225);
  // card?.printAnswer();
  // const str = getStringWithHighlightedSymbols('asd', [1]);
  // const res = tab(str, 2)
  // console.log(res);
  await f();

}


async function main() {
  const parser = new ArgumentParser({
    description: 'Argparse example'
  });
  parser.add_argument('--memory-node', {type: 'int'});
  parser.add_argument('--memory-node-interactive', {action: 'store_true'});
  parser.add_argument('--alias', {type: 'str'});
  parser.add_argument('--temp', {action: 'store_true'});

  parser.add_argument('--add-text-item', {type: 'int'});
  parser.add_argument('--question' );
  parser.add_argument('--answer' );
  const args = parser.parse_args();
  if (args.memory_node) {
    const nodeId = args.memory_node;
    const node = MEMORY_NODES_SERVICE.getMemoryNodeById(nodeId);
    await node?.interactive();
  }
  if (args.add_text_item) {
    const id = args.add_text_item;
    const questionText = args.question;
    const answerText = args.answer;
    addTextCardToNode(questionText, answerText, id);
  }
  if (args.memory_node_interactive) {
    console.log('alias ', args.alias);
    if (args.alias) {
      const node = MEMORY_NODES_SERVICE.getMemoryNodeByAlias(args.alias);
      node?.interactive();
      return;
    } else {
      console.log('No Alias');
    }
  }
  if (args.temp) {
    await temp();
  }
}

main().then(r => r);
