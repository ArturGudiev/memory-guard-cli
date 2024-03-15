import { BaseApiMongoService } from "../../../classes/abstract-classes/base-api-mongo-service";
import { Card, User } from "../../../classes";

export class UsersApiMongoService extends BaseApiMongoService<User> {

  createFromObj(obj: any): User {
    return User.createFromObj(obj);
  }

}
