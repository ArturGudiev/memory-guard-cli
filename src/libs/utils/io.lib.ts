import chalk from "chalk";

export function getTreeFromArray(arr: string[]): any {
  const tree: any = {name: arr[0], children: []};
  let curNode = tree;
  arr.slice(1).forEach((description, index) => {
    const newNode: any = {};
    newNode.name = description;
    newNode.children = [];
    curNode.children = [newNode];
    curNode = newNode;
  });
  return tree;
}

export function printTreeInColor(tree: any): void {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const printTree = require('print-tree');
  printTree(
    tree,
    // (node: any) => chalk.hex(COLORS[node.depth === 0 ? 0 : node.depth % COLORS.length])(node.name),
    (node: any) => node.children,
  );
}

export function printArrayAsTree(arr: string[]) {
  const printTree = require('print-tree');
  let tree: any = null;
  let index = 1;
  arr.reverse().forEach(el => {
    const children = tree === null ? [] : [tree];
    tree = {name: el, children, index: index++};
  });
  printTree(
    tree,
    (node: any) => node.name,
    (node: any) => node.children,
  );
}
