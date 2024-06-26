import { ArgumentParser } from "argparse";
import { addTextCardToNode } from "./libs/memory-nodes.lib";
import {
  CARDS_API_SERVICE,
  db,
  MEMORY_NODES_API_SERVICE,
  MEMORY_NODES_SERVICE,
  PRACTICE_ITEMS_API_SERVICE,
} from "./services/contianer";

async function temp() {
  const res = await PRACTICE_ITEMS_API_SERVICE.getItem('8c2bf8bf-04ed-4478-8e6e-bda03d69e29d');
  // res?.addExample('гёнёнтё 2')
  // console.log(res);
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
    const node = await MEMORY_NODES_API_SERVICE.getItem(nodeId);
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
      const node = await MEMORY_NODES_SERVICE.getMemoryNodeByAlias(args.alias);
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
