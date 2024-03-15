import { Meta } from "./api/cli/meta-api-cli.service";
import { META_API_SERVICE } from "./contianer";

export class MetaService {

  // getNextFieldValue(field: keyof Meta): number {
  //   // const meta = META_API_SERVICE.getMeta();
  //   // const id = ++meta[field];
  //   // META_API_SERVICE.saveMeta(meta);
  //   // return id;
  //   return 1;
  // }

  async getNextFieldValue(field: keyof Meta): Promise<number> {
    const res = await META_API_SERVICE.getFieldValue(field);
    META_API_SERVICE.incrementFieldValue(field);
    return res;
  }

  async getNextCardId(): Promise<number> {
    return this.getNextFieldValue('cardId');
  }

  async getNextUserId(): Promise<number> {
    return this.getNextFieldValue('userId');
  }

  async getNextMemoryNodeId(): Promise<number> {
    return this.getNextFieldValue('memoryNodeId');
  }

}

