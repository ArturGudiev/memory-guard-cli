import { getJSONFileContent, writeJSONFileContent } from "ag-utils-lib";

export interface Meta {
  memoryNodeId: number,
  cardId: number,
  userId: number
}

export class MetaApiCliService {

  constructor(public readonly FILE_PATH: string) {
  }

  getMeta(): Meta {
    return getJSONFileContent(this.FILE_PATH);
  }

  saveMeta(meta: Meta) {
    writeJSONFileContent(this.FILE_PATH, meta);
  }
}
