import {CARDS_SERVICE, MEMORY_NODES_SERVICE} from "./services/contianer";
import {ArgumentParser} from "argparse";
import {getJSONFileContent} from "./libs/utils.lib";
import {Subject} from "rxjs";
import {reactOnKeysPressed} from "./libs/interaction.lib";
import {addTextCardToNode} from "./libs/memory-nodes.lib";

async function temp() {
  const arr = getJSONFileContent("C:\\Data\\Lingvo-Practice\\raw_words\\iron.json");
  const newArr: any[] = arr.filter((el: any) => el.times === 0);
  console.log(newArr.length);
  let last = 100;
  for (const [i, el] of newArr.entries()){
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
  // newArr.forEach((el: any, i: number) => {
  //
  // });
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
