import {CARDS_SERVICE, MEMORY_NODES_SERVICE} from "./services/contianer";
import {ask} from "./libs/quiz.lib";

async function temp() {
  // const node = MEMORY_NODES_SERVICE.getMemoryNodeById(1)
  // if (node) {
  //   await node.interactive();
  // }
  const card = CARDS_SERVICE.getCardById(7);
  if (card) {
    await ask(card);
  }
  // console.log(card);
}


async function main() {
  await temp();
}

main().then(r => r);
