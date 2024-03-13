import { BaseApiMongoService } from "../../../classes/abstract-classes/base-api-mongo-service";
import { MemoryNode } from "../../../classes";

export class MemoryNodesApiMongoService extends BaseApiMongoService<MemoryNode> {

  createFromObj(obj: any): MemoryNode {
    return MemoryNode.createFromObj(obj);
  }

}
