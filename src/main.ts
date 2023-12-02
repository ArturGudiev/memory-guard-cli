import {MEMORY_NODES_SERVICE} from "./services/contianer";
import {ArgumentParser} from "argparse";
import {addTextCardToNode, parseExpressions} from "./libs/memory-nodes.lib";
import {moveCardsFromOneNodeToAnother} from "./libs/data-modifications.lib";
import {Card, UsageType} from "./classes/card";
import {waitForUserInput} from "./libs/utils.lib";

function setUsageTypeForAllCardsInNode(nodeId: number, usageType: UsageType) {
  const node = MEMORY_NODES_SERVICE.getMemoryNodeById(nodeId);
  if (node) {
    const cards = node.getCards();
    cards.forEach((card: Card) => {
      card.usageType = usageType;
      card.save();
    })
  }
}

async function temp() {
  // setUsageTypeForAllCardsInNode(25, 'transitional')
  // moveCardsFromOneNodeToAnother(25, 22);
  // const [a, b] = parseExpressions('count in [0;5] limit 25');
  // console.log(a);
  // console.log(b);
  // await waitForUserInput();
  // const node = MEMORY_NODES_SERVICE.getMemoryNodeById(22);
  // await node?.interactive();
  // const parser = new ArgumentParser({
  //   description: 'Argparse example'
  // });
  // parser.add_argument('--count', {type: 'int', default: 5});
  // const args = parser.parse_args([]);
  // const options: any | null = {
  //   rightAnswersQuantity: 5
  // };
  // if (args.count ){
  //   console.log('YES');
  // } else {
  //   console.log('No');
  // }
  await MEMORY_NODES_SERVICE.getMemoryNodeById(14)?.interactive();
}


async function main() {
  const parser = new ArgumentParser({
    description: 'Argparse example'
  });
  parser.add_argument('--memory-node', {type: 'int'});
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
  if (args.temp) {
    await temp();
  }
}

main().then(r => r);
