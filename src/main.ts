import { ArgumentParser } from "argparse";
import { addTextCardToNode } from "./libs/memory-nodes.lib";
import {CARDS_SERVICE, MEMORY_NODES_SERVICE, PRACTICE_ITEMS_SERVICE, USERS_API_SERVICE} from "./services/contianer";
import { getJSONFileContent } from "ag-utils-lib";
import { PracticeItem } from "./classes/practice-item";
import {User} from "./classes/user";
import {PRACTICE_ITEMS_FILE} from "./constants/files.constant";
import { MongoClient, ObjectId } from "mongodb";
import { MemoryNode } from "./classes";

const uri = "mongodb+srv://arturgudiev:arturgudievpwd@cluster0.5nqc5.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const dbName = 'memory-guard-v2';
export const db = client.db(dbName);

export async function getCollectionWord(collectionName: string, _id: ObjectId): Promise<any> {
  const collection = db.collection(collectionName);
  return await collection.findOne({_id: _id});
}


async function temp() {
  // const node = MEMORY_NODES_SERVICE.getMemoryNodeById(1);
  // await node?.interactive();
  const collection = db.collection<MemoryNode>('memory-nodes');
  const res = await collection.findOne({_id: 1});

  console.log('AAAA', res);
  // const res = await collection.find({_id: 1}).toArray();
  // console.log('res', res);
  // console.log('AAA');
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
