import { ArgumentParser } from "argparse";
import { PRACTICE_ITEMS_FILE, addTextCardToNode } from "./libs/memory-nodes.lib";
import {CARDS_SERVICE, MEMORY_NODES_SERVICE, PRACTICE_ITEMS_SERVICE} from "./services/contianer";
import { getJSONFileContent } from "ag-utils-lib";
import { PracticeItem } from "./classes/practice-item";


async function temp() {

  // const memoryNode = MEMORY_NODES_SERVICE.getMemoryNodeById(2);
  // memoryNode?.interactive();

  const card = CARDS_SERVICE.getCardById(339);
  card?.interactive();
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
