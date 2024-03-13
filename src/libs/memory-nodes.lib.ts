import {MemoryNode} from "../classes/memory-node"
import chalk from 'chalk';
import {
  CARDS_API_SERVICE,
  CARDS_SERVICE,
  MEMORY_NODES_API_SERVICE,
  MEMORY_NODES_SERVICE
} from "../services/contianer";
import {Card} from "../classes/card";
import {printArrayAsTree} from "./utils/io.lib";
import {getUserInput} from "ag-utils-lib";

export async function addNewMemoryNodesHandler(parent: MemoryNode): Promise<void> {
  const name = await getUserInput('Enter name');
  await MEMORY_NODES_SERVICE.addNewMemoryNodeWithNameAndParents(name, [parent]);
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
  '===': /^(\s*(\w*)\s*(===|=)\s*(\d*)\s*)(.*)/,
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

export class ExactEqualFilterExpression implements IFilterExpression {
  subject: string;
  value: number; // [a, b]

  constructor(subject: string, value: number) {
    this.subject = subject;
    this.value = value;
  }

  isTrueForObject(obj: any) {
    return obj[this.subject] === this.value;
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
  // const inCommandMatch = filterCommandTypeRegexes['in'].exec(originalCommandString);
  if (filterCommandTypeRegexes['in'].exec(originalCommandString)) {
    return true;
  }
  if (filterCommandTypeRegexes['==='].exec(originalCommandString)) {
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
  const exactEqualCommandMatch = filterCommandTypeRegexes['==='].exec(originalCommandString);
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
  if ( exactEqualCommandMatch ) {
    const subject = exactEqualCommandMatch[2];
    const value = Number(exactEqualCommandMatch[4]); // TODO possible different cases
    return [new ExactEqualFilterExpression(subject, value), exactEqualCommandMatch[5]];
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
      if (command === null) {
        break;
      }
      if (restString !== undefined) {
        originalCommand = restString;
      }

      if (command) {
        filterExpressions.push(command);
      }
    } else if (hasNextClauseExpression(originalCommand)) {
      const [command, restString] = parseNextClauseExpression(originalCommand);
      if (restString !== undefined) {
        originalCommand = restString;
      }

      if (command) {
        clauseExpressions.push(command);
      }
    } else {
      throw new Error();
    }
  }
  return [filterExpressions, clauseExpressions];
}

export function selectCards(cards: Card[], commandArgs: string[] | string): Card[] {
  const argsString = Array.isArray(commandArgs) ? commandArgs.join(' ') : commandArgs;
  const [filterExpressions, clauseExpressions]: [IFilterExpression[], IClauseExpression[]] = parseExpressions(argsString);
  let cardsToReturn = cards
    .filter(card => filterExpressions
      .every(exp => exp.isTrueForObject(card)));
  for (const clauseExpression of clauseExpressions) {
    cardsToReturn = clauseExpression.apply<Card>(cardsToReturn);
  }
  return cardsToReturn;
}

export async function printParentsPath(node: MemoryNode) {
  const parentsPath = await getParentsPath(node);
  printArrayAsTree(parentsPath);
}

export async function getParentsPath(obj: MemoryNode): Promise<string[]> {
  const getNodeDescriptionInParentsPath = (node: MemoryNode) => `${node._id} ` + node.name
  const parentsPath: string[] = [getNodeDescriptionInParentsPath(obj)];

  let parent: MemoryNode | null = (await obj.getParents())[0];

  while ( parent ) {
    parentsPath.push(getNodeDescriptionInParentsPath(parent));
    const parents = await parent.getParents();
    parent = parents.length > 0 ? parents[0] : null;
  }
  return parentsPath.reverse();
}

export async function addTextCardToNode(questionText: string, answerText: string, id: number) {
  const card = await CARDS_SERVICE.createFromText(questionText, answerText, id);
  if (card) {
    const node = await MEMORY_NODES_API_SERVICE.getItem(id);
    if (node) {
      await CARDS_API_SERVICE.addItem(card);
      node.cards.push(card._id);
      await node?.save();
    }
  }
}
