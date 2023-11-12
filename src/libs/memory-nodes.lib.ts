import {MemoryNode} from "../classes/memory-node"
import chalk from 'chalk';
import {getUserInput} from "./utils.lib";
import {MEMORY_NODES_SERVICE} from "../services/contianer";
import {Card} from "../classes/card";

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


export function selectCards(cards: Card[], commandArgs: string[]) {

}