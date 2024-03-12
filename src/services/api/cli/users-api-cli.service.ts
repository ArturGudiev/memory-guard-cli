import {User} from "../../../classes/user";
import { BaseApiCliService } from "../../../classes/abstract-classes/base-api-cli-service";

export class UsersApiCliService extends BaseApiCliService<User> {


  constructor(FILE_PATH: string) {
    super(FILE_PATH);
  }

  createFromObj(obj: any): User {
      return User.createFromObj(obj);
    }

}
