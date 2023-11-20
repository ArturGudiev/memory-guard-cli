import {MemoryNode} from "../classes/memory-node"
import chalk from 'chalk';
import {getUserInput} from "./utils.lib";
import {CARDS_SERVICE, MEMORY_NODES_SERVICE} from "../services/contianer";
import {Card} from "../classes/card";
import {printArrayAsTree} from "./utils/io.lib";

export const MEMORY_NODES_FILE_NAME = "C:\\Programming\\NodeJS\\memory-guard-cli\\data\\memory-nodes.json";
export const CARDS_FILE_NAME = "C:\\Programming\\NodeJS\\memory-guard-cli\\data\\cards.json";
export const META_FILE = "C:\\Programming\\NodeJS\\memory-guard-cli\\data\\meta.json"

export async function addNewMemoryNodesHandler(parent: MemoryNode): Promise<void> {
  const name = await getUserInput('Enter name');
  MEMORY_NODES_SERVICE.addNewMemoryNodeWithNameAndParents(name, [parent]);
}

export function printMemoryNodes(nodes: MemoryNode[]) {
  console.log();
  nodes.forEach((node, i: number) => {
    console.log(chalk.green(`\t${i + 1}. ${node.children.length > 0 ? '*' : ''}${node.name} \t`));
  });
  console.log();
}

export function printMemoryNodesWithTitle(nodes: MemoryNode[]): void {
  if (nodes.length > 0) {
    console.log(('\t------ Memory Nodes ------'));
    printMemoryNodes(nodes);
  }
}


type IFilterCommandType = '<' | '<=' | '>' | '>=' | '==' | '===' | 'in';
export const filterCommandTypeRegexes: {[key in IFilterCommandType]: RegExp} = {
  '<': /(\s*(\w*)\s*<\s*(\d*)\s*)(.*)/,
  '<=': /(\s*(\w*)\s*<=\s*(\d*)\s*)(.*)/,
  '>': /(\s*(\w*)\s*>\s*(\d*)\s*)(.*)/,
  '>=': /(\s*(\w*)\s*>=\s*(\d*)\s*)(.*)/,
  '==': /(\s*(\w*)\s*==\s*(\d*)\s*)(.*)/,
  '===': /(\s*(\w*)\s*===\s*(\d*)\s*)(.*)/,
  'in': /(\s*(\w*)\s*in\s*([\[|\(])\s*(\d+)\s*;\s*(\d+)\s*([\]|\)])\s*)(.*)/,
};

export interface IFilterExpression {
  // type: IFilterCommandType
  subject: string
  isTrueForObject(obj: any): boolean;
}

export class InFilterExpression implements IFilterExpression {
  subject: string;
  span: [number, number]; // [a, b]

  constructor(subject: string, object: [number, number]) {
    this.subject = subject;
    this.span = object; // check both numbers
  }

  isTrueForObject(obj: any) {
    return obj[this.subject] >= this.span[0] && obj[this.subject] <= this.span[1];
  }
}

/**
 * Возвращает tuple IFilterExpression
 * @param originalCommandString
 */
export function parseNextFilterExpression(originalCommandString: string): [IFilterExpression, string] | [] {
  const inCommandMatch = filterCommandTypeRegexes['in'].exec(originalCommandString);
  if ( inCommandMatch ) {
    const subject = inCommandMatch[2];
    const leftBorder = inCommandMatch[3];
    const start: number = +inCommandMatch[4];
    const end: number = +inCommandMatch[5];
    const rightBorder = inCommandMatch[6];
    return [new InFilterExpression(subject, [
      leftBorder === '[' ? start : start + 1,
      rightBorder === ']' ? end : end - 1
    ]), inCommandMatch[7]];
  }
  throw new Error('Here');
}
// todo you can add () and or 
export function parseFilterExpressions(originalCommand: string): IFilterExpression[] {
  const conditions: IFilterExpression[] = [];
  while (originalCommand !== '') {
    const [command, restString] = parseNextFilterExpression(originalCommand);
    if (restString !== undefined) {
      originalCommand = restString;
    }

    if (command) {
      conditions.push(command);
    }
  }
  return conditions;
}

export function parseFilterCommands(argsString: string) {

}

export function selectCards(cards: Card[], commandArgs: string[]): Card[] {
  const argsString = commandArgs.join(' ');
  const filterExpressions: IFilterExpression[] = parseFilterExpressions(argsString);
  return cards
    .filter(card => filterExpressions
      .every(exp => exp.isTrueForObject(card)));
}

export function printParentsPath(node: MemoryNode) {
  const parentsPath = getParentsPath(node);
  // const parentsTree = getTreeFromArray(parentsPath);
  // console.log(JSON.stringify(parentsTree));
  // printTreeInColor(parentsTree);
  printArrayAsTree(parentsPath);
}

export function getParentsPath(obj: MemoryNode): string[] {
  const parentsPath: string[] = [obj.name];
  let parent: MemoryNode | null = obj.getParents()[0];
  while ( parent ) {
    parentsPath.push(`${parent._id} ` + parent.name);
    parent = parent.getParents().length > 0 ? parent.getParents()[0] : null;
  }
  return parentsPath.reverse();
}

export function addTextCardToNode(questionText: string, answerText: string, id: number) {
  const card = CARDS_SERVICE.createFromText(questionText, answerText, id);
  if (card) {
    const node = MEMORY_NODES_SERVICE.getMemoryNodeById(id);
    if (node) {
      CARDS_SERVICE.addCard(card);
      node.cards.push(card._id);
      node?.save();
    }
  }
}
