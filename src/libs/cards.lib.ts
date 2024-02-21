import {CardItem} from "../classes/card-items/card-item";
import {fMap} from "./utils.lib";
import chalk from "chalk";
import {Card} from "../classes/card";
import {Table} from 'console-table-printer';
import {getUserInput, newline, printWithoutNewLine} from "ag-utils-lib";
import {htmlNewLine} from "./utils/browser.utils";
import {TextCardItem} from "../classes/card-items/text-card-item";
import {ImageCardItem} from "../classes/card-items/image-card-item";
import {TextWithHighlightedSymbolCardItem} from "../classes/card-items/text-with-highlighted-symbol";

export async function fillCardItemsArray(cardItems: CardItem[], prefix = '') {
  while (true) {
    console.clear();
    printCardItemsArray(cardItems, prefix);
    const command = await getUserInput('Enter a question command');
    if (command.startsWith('t+') ) {
      const textItem = await TextCardItem.createInteractively(command === 't+!');
      if (textItem !== null) {
        cardItems.push(textItem);
      }
    }
    if (command.startsWith('i+') ) {
      const imageItem = await ImageCardItem.createInteractively();
      if (imageItem !== null) {
        cardItems.push(imageItem);
      }
    }
    if (command.startsWith('th+') ) {
      const item = await TextWithHighlightedSymbolCardItem.createInteractively();
      if (item !== null) {
        cardItems.push(item);
      }
    }

    if (command === 'x') {
      break;
    }
  }
}

export function printCardsArray(cards: Card[]) {
  const arrToPrint =
    cards.map(card => `'${chalk.green(card.getOneLineQuestion())}'\t`);
  for (const cardString of arrToPrint) {
    printWithoutNewLine(cardString)
  }
}

export function printCardsWithTitle(cards: Card[]): void {
  if ( cards.length > 0 ) {
    console.log(('\t------ Cards ------'));
    console.log();
    printCardsArray(cards);
    console.log();
    newline(2);
  }
}

export interface IQuantityStatsItem {
  count: number;
  quantity: number;
}

export function printStats(cards: Card[], field: 'count' | 'practiceCount' = 'count'): void {
  const fieldValues = fMap(cards, field);
  if ( cards.length > 0 ) {
    const valuesSet = new Set(fieldValues);
    const uniqueSortedValuesArr = [...valuesSet].sort((x, y) => x - y);
    const p = new Table();
    for (const value of uniqueSortedValuesArr) {
      // stats.push({
      p.addRow({
        [field]: value,
        quantity: fieldValues
          .reduce((elCount, el) => el === value ? elCount + 1 : elCount, 0)
      });
    }
    p.printTable();
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


export function getCardItemsInHTML(items: CardItem[]): string {
  return items.map(item => item.getHTML())
    .reduce((item1, item2) => item1 + htmlNewLine() + item2);
}
