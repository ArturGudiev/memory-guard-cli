import {CardItem, TextCardItem} from "../classes/card-item";
import {getUserInput} from "./utils.lib";
import chalk from "chalk";
import {MemoryNode} from "../classes/memory-node";
import {printMemoryNodes} from "./memory-nodes.lib";
import {Card} from "../classes/card";

export async function fillCardItemsArray(cardItems: CardItem[], prefix = '') {
  while (true) {
    console.clear();
    printCardItemsArray(cardItems, prefix);
    const command = await getUserInput('Enter a question command');
    if (command === 't+') {
      const textItem = await TextCardItem.createInteractively();
      if (textItem !== null) {
        cardItems.push(textItem);
      }
    }
    if (command === 'x') {
      break;
    }
  }
}

export function printCardsWithTitle(cards: Card[]): void {
  if ( cards.length > 0 ) {
    console.log(('\t------ Cards ------'));
    console.log();
    cards.forEach((card: Card, index: number) => {
      console.log(chalk.yellowBright(`\t ${index + 1}. ${card.question[0].getOneLineText()}`));
    })
    console.log();
  }
}


export function printCardItemsArray(cardItems: CardItem[], prefix = '') {
  console.log();
  console.log(`\t------ ${[prefix]} Card Items ------`);
  console.log();
  cardItems.forEach((item: CardItem) => {
    console.log(chalk.blue(`\t${item.getOneLineCardItemRepresentation()}`));
  });
  console.log();
}
