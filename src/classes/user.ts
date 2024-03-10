import {getJSONFileContent, getUserInput, isNumeric, selectFromList, writeFileContent} from "ag-utils-lib";

import {META_FILE} from "../constants/files.constant";

export type UserRole = 'admin' | 'user';

export class User {
  _id: number;
  username: string;
  password: string;
  role: UserRole;
  rootNode: number;

  constructor(id: number, username: string, password: string, role: UserRole, rootNode: number) {
    this._id = id;
    this.username = username;
    this.password = password;
    this.role = role;
    this.rootNode = rootNode;
  }

  static createFromObj(obj: User) {
    return new User(obj._id, obj.username, obj.password, obj.role, obj.rootNode);
  }

  static getNextUserId(): number {
    const meta = getJSONFileContent(META_FILE);
    const id = ++meta.userId;
    writeFileContent(META_FILE, meta);
    return id;
  }


  static async createInteractively(): Promise<User> {
    const username = await getUserInput('Enter username');
    const password = await getUserInput('Enter password');
    const role: UserRole = await selectFromList(['admin', 'user'], 'Enter role') as UserRole;
    const rootNode = await getUserInput('Enter root node id');
    if (!isNumeric(rootNode)) {
      throw new Error(`Not numeric ${rootNode}`);
    }
    return new User(User.getNextUserId(), username, password, role, +rootNode);

  }
}
