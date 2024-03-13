import {User} from "../classes/user";
import { MEMORY_NODES_API_SERVICE, MEMORY_NODES_SERVICE, USERS_API_SERVICE } from "./contianer";
import {MemoryNode} from "../classes/memory-node";

export class UsersService {

  async getUserRootNode(user: User): Promise<MemoryNode> {
    const rootNodeId = user.rootNode;
    const node = await MEMORY_NODES_API_SERVICE.getItem(rootNodeId);
    if (!node) {
      throw new Error('Cant find user root node');
    }
    return node;
  }

  async getUserByCredentials(username: string, password: string): Promise<User | undefined> {
    const users = await USERS_API_SERVICE.getAllItems();
    return users.find(u => u.username === username && u.password === password);
  }
}
