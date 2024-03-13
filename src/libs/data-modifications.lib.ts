import {Subject} from "rxjs";
import {reactOnKeysPressed} from "./interaction.lib";
import {addTextCardToNode} from "./memory-nodes.lib";
import { MEMORY_NODES_API_SERVICE, MEMORY_NODES_SERVICE } from "../services/contianer";
import {Card} from "../classes/card";
import { getJSONFileContent } from "ag-utils-lib";

export async function sortCollectionByNodes() {
  const arr = getJSONFileContent("C:\\Data\\Lingvo-Practice\\raw_words\\iron.json");
  const newArr: any[] = arr.filter((el: any) => el.times === 0);
  console.log(newArr.length);
  let last = 100;
  for (const [i, el] of newArr.entries()) {
    if (i <= last) {
      continue;
    }
    console.clear();
    console.log(i, el.name, el.translation);
    let answerWasShowed = false;
    const exitSubject = new Subject<void>();
    await reactOnKeysPressed(
      {
        'a': async () => {
          console.log('active', el)
          await addTextCardToNode(el.name, el.translation, 23);
          exitSubject.next();
        },
        'p': async () => {
          console.log('passive', el);
          await addTextCardToNode(el.name, el.translation, 24);
          exitSubject.next();
        },
        't': async () => {
          console.log('transitional', el);
          await addTextCardToNode(el.name, el.translation, 25);
          exitSubject.next();
        }
      },
      ['x'],
      exitSubject
    );
    // 23. Active
    // 24. Passive
    // 25. Transitional


  }
}

export async function moveCardsFromOneNodeToAnother(fromNodeId: number, toNodeId: number) {
  const fromNode = await MEMORY_NODES_API_SERVICE.getItem(fromNodeId);
  const toNode = await MEMORY_NODES_API_SERVICE.getItem(toNodeId);
  if (fromNode && toNode) {
    const fromNodeCards = await fromNode.getCards();
    // todo make it in 1 step
    fromNodeCards.forEach((card: Card, index: number) => {
      console.log(index, `moving ${card._id}`)
      card.parentNodes = card.parentNodes.filter((nodeId: number) => nodeId !== fromNode._id);
      card.parentNodes.push(toNode._id);
      card.save();

      fromNode.cards = fromNode.cards.filter(cardId => cardId !== card._id);
      fromNode.save();

      toNode.cards.push(card._id);
      toNode.save();
    });
  }
}
