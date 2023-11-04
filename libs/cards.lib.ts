import {CardItem, TextCardItem} from "../classes/card-item";
import {getUserInput} from "./utils.lib";
import chalk from "chalk";

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

export function printCardItemsArray(cardItems: CardItem[], prefix = '') {
  console.log();
  console.log(`\t------ ${[prefix]} Card Items ------`);
  console.log();
  cardItems.forEach((item: CardItem) => {
    console.log(chalk.blue(`\t${item.getOneLineRepresentation()}`));
  });
  console.log();
}
