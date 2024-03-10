import {BaseApiCliService} from "../../interfaces/service-interfaces";
import {User} from "../../classes/user";

export class UsersApiCliService extends BaseApiCliService<User> {


  constructor(FILE_PATH: string) {
    super(FILE_PATH);
  }

  createFromObj(obj: any): User {
      return User.createFromObj(obj);
    }

}
