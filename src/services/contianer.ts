import {ICardsService, IMemoryNodesService, IPracticeItemsService} from "./service-interfaces";
import {MemoryNodesCliService} from "./memory-nodes.service";
import {CardsCliService} from "./cards-cli.service";
import { PracticeItemsCliService } from "./practice-items-cli.service";
import {User} from "../classes/user";
import {ApiService} from "../interfaces/service-interfaces";
import {UsersApiCliService} from "./api/users-api-cli.service";

import {USERS_FILE} from "../constants/files.constant";

export class Container {
  memoryNodesService: IMemoryNodesService;
  cardsService: ICardsService;
  practiceItemsService: IPracticeItemsService;
  usersApiService: ApiService<User>;
  private static instance: Container | null = null;

  private constructor() {
    this.memoryNodesService = new MemoryNodesCliService();
    this.cardsService = new CardsCliService();
    this.practiceItemsService = new PracticeItemsCliService();
    this.usersApiService = new UsersApiCliService(USERS_FILE);
  }

  static getInstance(): Container {
    if (Container.instance === null) {
      Container.instance = new Container();
    }
    return Container.instance;
  }
}

export const SERVICE_CONTAINER = Container.getInstance();
export const MEMORY_NODES_SERVICE: IMemoryNodesService = SERVICE_CONTAINER.memoryNodesService;
export const CARDS_SERVICE = SERVICE_CONTAINER.cardsService;
export const PRACTICE_ITEMS_SERVICE = SERVICE_CONTAINER.practiceItemsService;
export const USERS_API_SERVICE = SERVICE_CONTAINER.usersApiService;
