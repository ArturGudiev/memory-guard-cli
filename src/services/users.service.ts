import {User} from "../classes/user";
import {MEMORY_NODES_SERVICE, USERS_API_SERVICE} from "./contianer";
import {MemoryNode} from "../classes/memory-node";

export class UsersService {

  getUserRootNode(user: User): MemoryNode {
    const rootNodeId = user.rootNode;
    const node = MEMORY_NODES_SERVICE.getMemoryNodeById(rootNodeId);
    if (!node) {
      throw new Error('Cant find user root node');
    }
    return node;
  }

  getUserByCredentials(username: string, password: string): User | undefined {
    const users = USERS_API_SERVICE.getAllItems();
    return users.find(u => u.username === username && u.password === password);
  }
}
