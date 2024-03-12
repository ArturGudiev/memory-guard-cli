import { BaseApiMongoService } from "../../../classes/abstract-classes/base-api-mongo-service";
import { Card } from "../../../classes";

export class CardsApiMongoService extends BaseApiMongoService<Card> {

  createFromObj(obj: any): Card {
    return Card.createFromObj(obj);
  }

}
