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
type ClauseType = 'limit';
export const filterCommandTypeRegexes: {[key in IFilterCommandType]: RegExp} = {
  '<': /^(\s*(\w*)\s*<\s*(\d*)\s*)(.*)/,
  '<=': /^(\s*(\w*)\s*<=\s*(\d*)\s*)(.*)/,
  '>': /^(\s*(\w*)\s*>\s*(\d*)\s*)(.*)/,
  '>=': /^(\s*(\w*)\s*>=\s*(\d*)\s*)(.*)/,
  '==': /^(\s*(\w*)\s*==\s*(\d*)\s*)(.*)/,
  '===': /^(\s*(\w*)\s*===\s*(\d*)\s*)(.*)/,
  'in': /^(\s*(\w*)\s*in\s*([\[|\(])\s*(\d+)\s*;\s*(\d+)\s*([\]|\)])\s*)(.*)/,
};

export const clauseRegexes: {[key in ClauseType]: RegExp} = {
  'limit': /^\s*limit\s*(\d+)(.*)/,
};


export interface IClauseExpression {
  apply: <T = unknown>(arr: T[]) => T[]
}

export class LimitClauseExpression implements IClauseExpression {
  limit: number;

  constructor(limit: number) {
    this.limit = limit;
  }

  apply<T>(arr: T[]): T[] {
    return arr.slice(0, this.limit);
  }

}

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

export function hasNextClauseExpression(originalCommandString: string): boolean {
  const limitMatch = clauseRegexes['limit'].exec(originalCommandString);
  if (limitMatch) {
    return true;
  }
  return false;
}

export function parseNextClauseExpression(originalCommand: string): [IClauseExpression, string] | [null, string] {
  const limitCommandMatch = clauseRegexes['limit'].exec(originalCommand);
  if ( limitCommandMatch ) {
    const limit = +limitCommandMatch[1];
    return [new LimitClauseExpression(limit), limitCommandMatch[2]];
  }
  return [null, originalCommand];
}

export function hasNextFilterExpression(originalCommandString: string): boolean {
  const inCommandMatch = filterCommandTypeRegexes['in'].exec(originalCommandString);
  if (inCommandMatch) {
    return true;
  }
  return false;
}

/**
 * Возвращает tuple IFilterExpression
 * @param originalCommandString
 */
export function parseNextFilterExpression(originalCommandString: string): [IFilterExpression, string] | [null, string] {
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
  return [null, originalCommandString];
}
// todo you can add () and or 
export function parseExpressions(originalCommand: string): [IFilterExpression[], IClauseExpression[]] {
  const filterExpressions: IFilterExpression[] = [];
  const clauseExpressions: IClauseExpression[] = [];
  while (originalCommand !== '') {
    if (hasNextFilterExpression(originalCommand)) {
      const [command, restString] = parseNextFilterExpression(originalCommand);
      if (restString !== undefined) {
        originalCommand = restString;
      }

      if (command) {
        filterExpressions.push(command);
      }
    }
    if (hasNextClauseExpression(originalCommand)) {
      const [command, restString] = parseNextClauseExpression(originalCommand);
      if (restString !== undefined) {
        originalCommand = restString;
      }

      if (command) {
        clauseExpressions.push(command);
      }
    }
  }
  return [filterExpressions, clauseExpressions];
}

export function selectCards(cards: Card[], commandArgs: string[]): Card[] {
  const argsString = commandArgs.join(' ');
  const [filterExpressions, clauseExpressions]: [IFilterExpression[], IClauseExpression[]]
    = parseExpressions(argsString);
  let cardsToReturn = cards
    .filter(card => filterExpressions
      .every(exp => exp.isTrueForObject(card)));
  for (const clauseExpression of clauseExpressions) {
    cardsToReturn = clauseExpression.apply<Card>(cardsToReturn);
  }
  return cardsToReturn;
}

export function printParentsPath(node: MemoryNode) {
  const parentsPath = getParentsPath(node);
  // const parentsTree = getTreeFromArray(parentsPath);
  // console.log(JSON.stringify(parentsTree));
  // printTreeInColor(parentsTree);
  printArrayAsTree(parentsPath);
}

export function getParentsPath(obj: MemoryNode): string[] {
  const getNodeDescriptionInParentsPath = (node: MemoryNode) => `${node._id} ` + node.name
  const parentsPath: string[] = [getNodeDescriptionInParentsPath(obj)];

  let parent: MemoryNode | null = obj.getParents()[0];

  while ( parent ) {
    parentsPath.push(getNodeDescriptionInParentsPath(parent));
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
