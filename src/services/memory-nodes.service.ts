import {equalLowerStrings, getJSONFileContent, writeFileContent} from "ag-utils-lib";
import {MemoryNode} from "../classes/memory-node";
import {META_FILE, MEMORY_NODES_FILE_NAME} from "../libs/memory-nodes.lib";
import {IMemoryNodesService} from "./service-interfaces";
import {writeFileSync} from "fs";
import {some} from "lodash";

export class MemoryNodesCliService implements IMemoryNodesService {

  nodeExists(id: number): boolean {
    const node = this.getMemoryNodeById(id);
    return node !== null;
  }

  addMemoryNode(node: MemoryNode): void {
    const nodes = this.getAllMemoryNodes();
    nodes.push(node);
    this.saveAllMemoryNodes(nodes);
  }

  getAllMemoryNodes(): MemoryNode[] {
    const nodes: any[] = getJSONFileContent(MEMORY_NODES_FILE_NAME);
    return nodes.map((node: any) => MemoryNode.createFromObj(node));
  }

  getMemoryNodeById(_id: number): MemoryNode | null {
    const nodes: any[] = getJSONFileContent(MEMORY_NODES_FILE_NAME);
    const nodeObj = nodes.find(node => node._id === _id);
    return nodeObj ? MemoryNode.createFromObj(nodeObj) : null;
  }

  getMemoryNodesByIDs(ids: number[]): MemoryNode[] {
    let arr = getJSONFileContent(MEMORY_NODES_FILE_NAME);
    arr = arr
      .filter((node: MemoryNode) => ids.includes(node._id))
      .map((nodeObj: MemoryNode) =>
        MemoryNode.createFromObj(nodeObj));
    // return setOrder(arr, ids);
    return arr;
  }

  updateMemoryNode(nodeToSave: MemoryNode): void {
    const nodes: any[] = getJSONFileContent(MEMORY_NODES_FILE_NAME);
    const index = nodes.findIndex((node: any) => node._id === nodeToSave._id);
    nodes[index] = nodeToSave;
    this.saveAllMemoryNodes(nodes);
  }

  deleteMemoryNode(memoryNode: MemoryNode): void {
    const tasks = this.getAllMemoryNodes();
    // move to trash
    const index = tasks.findIndex((t: MemoryNode) => t._id === memoryNode._id);

    // filter tasks
    tasks.splice(index, 1);
    this.saveAllMemoryNodes(tasks);

    for (let parent of memoryNode.getParents()) {
      parent.children = parent.children.filter(id => id !== memoryNode._id);
      parent.save();
    }
  }

  /**
   *
   * @param name
   * @param parents
   */
  addNewMemoryNodeWithNameAndParents(name: string, parents: MemoryNode[]): void {
    const newNodeId = this.getNextMemoryNodeId();
    const newNode =
      new MemoryNode(newNodeId, name, [], parents.map(p => p._id), [], []);
    this.addMemoryNode(newNode);
    parents[0].children.push(newNodeId);
    parents[0].save();
  }

  /**
   *
   */
  isAliasUsed(aliasToCheck: string): boolean {
    const nodes = this.getAllMemoryNodes();
    return some(nodes, node => some(node.aliases,
      alias => equalLowerStrings(alias, aliasToCheck)));
  }

  /**
   * Находит вершину по синониму
   * @param alias
   */
  getMemoryNodeByAlias(alias: string): MemoryNode | null {
    const nodes = this.getAllMemoryNodes();
    const node = nodes.find(n => n.aliases.includes(alias));
    return node ?? null;
  }

  getNextMemoryNodeId(): number {
    const meta = getJSONFileContent(META_FILE);
    const id = ++meta.memoryNodeId;
    writeFileContent(META_FILE, meta);
    return id;
  }

  private saveAllMemoryNodes(nodes: MemoryNode[]) {
    writeFileSync(MEMORY_NODES_FILE_NAME, JSON.stringify(nodes, null, '\t'));
  }


}
