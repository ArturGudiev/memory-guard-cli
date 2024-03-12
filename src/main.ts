import { ArgumentParser } from "argparse";
import { addTextCardToNode } from "./libs/memory-nodes.lib";
import {
  CARDS_API_SERVICE,
  CARDS_SERVICE,
  MEMORY_NODES_SERVICE, META_SERVICE,
  PRACTICE_ITEMS_SERVICE,
  USERS_API_SERVICE
} from "./services/contianer";
import { getJSONFileContent } from "ag-utils-lib";
import { PracticeItem } from "./classes/practice-item";
import {User} from "./classes/user";
import {PRACTICE_ITEMS_FILE} from "./constants/files.constant";
import { MongoClient, ObjectId } from "mongodb";
import { Card, MemoryNode } from "./classes";

// const uri = "mongodb+srv://arturgudiev:arturgudievpwd@cluster0.5nqc5.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri);
// const dbName = 'memory-guard-v2';
// export const db = client.db(dbName);

// export async function getCollectionWord(collectionName: string, _id: ObjectId): Promise<any> {
//   const collection = db.collection(collectionName);
//   return await collection.findOne({_id: _id});
// }


async function temp() {
  // const cards = await CARDS_API_SERVICE.getItems([7, 343])
  // @ts-ignore
  const card = await CARDS_API_SERVICE.getItem(7);

  if ( card ) {
    // card.count--;
    await CARDS_API_SERVICE.updateItem(card);
    // console.log('DONE');
    console.log('card', card);
  } else {
    console.log('NO');
  }

  // const card2 = new Card(META_SERVICE.getNextCardId(), [], [], [], 0, 0, 0, {
  //   reverseCount: 0,
  //   practiceCount: 0,
  //   usageType: 'common'
  // });
  // CARDS_API_SERVICE.addItem(card2);
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
