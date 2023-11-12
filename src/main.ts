import {CARDS_SERVICE, MEMORY_NODES_SERVICE} from "./services/contianer";
import {testCard, testCards} from "./libs/quiz.lib";
import {getRandomArbitrary} from "./libs/utils/random.lib";
import {random} from "lodash";
import {ArgumentParser} from "argparse";

async function temp() {
  // const node = MEMORY_NODES_SERVICE.getMemoryNodeById(1)
  // if (node) {
  //   await node.interactive();
  // }
  // const cards = CARDS_SERVICE.getCardsByIDs([7, 6]);
  // if (cards.length > 0) {
  //   await testCards(cards);
    // while (true) {
    //   await testCard(card);
    // }
  // }
  // console.log(card);
  console.log();
}


async function main() {
  console.log('HERE main');
  const parser = new ArgumentParser({
    description: 'Argparse example'
  });
  parser.add_argument('--memory-node', {type: 'int'});
  parser.add_argument('--temp', {action: 'store_true'});
  const args = parser.parse_args();
  if (args.memory_node) {
    const nodeId = args.memory_node;
    const node = MEMORY_NODES_SERVICE.getMemoryNodeById(nodeId);
    await node?.interactive();
  }
  await temp();
}

main().then(r => r);
