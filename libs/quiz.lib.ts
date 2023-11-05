import {Card} from "../classes/card";
import {question} from "readline-sync";
import {waitForUserInput} from "./utils.lib";
import {reactOnKeysPressed} from "./interaction.lib";

export function quiz(cards: Card[]) {

}

export async function ask(card: Card) {
  console.clear();
  card.printStats();
  card.printQuestion();
  await reactOnKeysPressed(
    {
      'a': () => {
        card.count += 1;
        card.update();
        console.clear();
        card.printStats();
        card.printQuestion();
      }
    }
  );
}
