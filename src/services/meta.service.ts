import { Meta } from "./api/cli/meta-api-cli.service";
import { META_API_SERVICE } from "./contianer";

export class MetaService {

  getNextFieldValue(field: keyof Meta): number {
    const meta = META_API_SERVICE.getMeta();
    const id = ++meta[field];
    META_API_SERVICE.saveMeta(meta);
    return id;
  }

  getNextCardId(): number {
    return this.getNextFieldValue('cardId');
  }

  getNextUserId(): number {
    return this.getNextFieldValue('userId');
  }

  getMemoryNodeId(): number {
    return this.getNextFieldValue('memoryNodeId');
  }

}

