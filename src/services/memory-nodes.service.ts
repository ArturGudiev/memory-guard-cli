import {equalLowerStrings} from "ag-utils-lib";
import {MemoryNode} from "../classes";
import {writeFileSync} from "fs";
import {some} from "lodash";
import {MEMORY_NODES_FILE_NAME, META_FILE} from "../constants/files.constant";
import { MEMORY_NODES_API_SERVICE, META_SERVICE } from "./contianer";

export class MemoryNodesService {

  async nodeExists(id: number): Promise<boolean> {
    const node = await MEMORY_NODES_API_SERVICE.getItem(id);
    return node !== null;
  }

  /**
   *
   * @param name
   * @param parents
   */
  async addNewMemoryNodeWithNameAndParents(name: string, parents: MemoryNode[]): Promise<void> {
    const newNodeId = await META_SERVICE.getNextMemoryNodeId();
    const newNode =
      new MemoryNode(newNodeId, name, [], parents.map(p => p._id), [], []);
    await MEMORY_NODES_API_SERVICE.addItem(newNode);
    parents[0].children.push(newNodeId);
    await parents[0].save();
  }

  /**
   *
   */
  async isAliasUsed(aliasToCheck: string): Promise<boolean> {
    const nodes = await MEMORY_NODES_API_SERVICE.getAllItems();
    return some(nodes, node => some(node.aliases,
      alias => equalLowerStrings(alias, aliasToCheck)));
  }

  /**
   * Находит вершину по синониму
   * @param alias
   */
  async getMemoryNodeByAlias(alias: string): Promise<MemoryNode | null> {
    const nodes = await MEMORY_NODES_API_SERVICE.getAllItems();
    const node = nodes.find(n => n.aliases.includes(alias));
    return node ?? null;
  }

  // getNextMemoryNodeId(): number {
  //   const meta = getJSONFileContent(META_FILE);
  //   const id = ++meta.memoryNodeId;
  //   writeFileContent(META_FILE, meta);
  //   return id;
  // }

  private saveAllMemoryNodes(nodes: MemoryNode[]) {
    writeFileSync(MEMORY_NODES_FILE_NAME, JSON.stringify(nodes, null, '\t'));
  }

}
