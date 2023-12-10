import {ArgumentParser} from "argparse";
import {Card, UsageType} from "./classes/card";
import {addTextCardToNode} from "./libs/memory-nodes.lib";
import {MEMORY_NODES_SERVICE} from "./services/contianer";
import {getUserInput, waitForUserInput} from "ag-utils-lib";
import chalk from "chalk";
import {psFocusOnApp, runPowerShellCommand} from "./libs/utils/powershell";
import {exec} from "child_process";

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
    const number1 = getRandomInt(1, 9);
    const number2 = getRandomInt(1, 9);
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
async function temp() {
  // psFocusOnApp('Notepad');
  // exec('pwsh.exe ')
  // runPowerShellCommand('br google.com')
  psFocusOnApp('PowerShell');

}


async function main() {
  const parser = new ArgumentParser({
    description: 'Argparse example'
  });
  parser.add_argument('--memory-node', {type: 'int'});
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
  if (args.temp) {
    await temp();
  }
}

main().then(r => r);
