import {getJSONFileContent} from "./utils.lib";
import {Subject} from "rxjs";
import {reactOnKeysPressed} from "./interaction.lib";
import {addTextCardToNode} from "./memory-nodes.lib";
import {MEMORY_NODES_SERVICE} from "../services/contianer";
import {Card} from "../classes/card";

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
        'a': () => {
          console.log('active', el)
          addTextCardToNode(el.name, el.translation, 23);
          exitSubject.next();
        },
        'p': () => {
          console.log('passive', el);
          addTextCardToNode(el.name, el.translation, 24);
          exitSubject.next();
        },
        't': () => {
          console.log('transitional', el);
          addTextCardToNode(el.name, el.translation, 25);
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

export function moveCardsFromOneNodeToAnother(fromNodeId: number, toNodeId: number) {
  const fromNode = MEMORY_NODES_SERVICE.getMemoryNodeById(fromNodeId);
  const toNode = MEMORY_NODES_SERVICE.getMemoryNodeById(toNodeId);
  if (fromNode && toNode) {
    const fromNodeCards = fromNode.getCards();
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
