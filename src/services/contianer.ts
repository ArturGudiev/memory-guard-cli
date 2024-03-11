import {ICardsService, IMemoryNodesService, IPracticeItemsService} from "./service-interfaces";
import {MemoryNodesCliService} from "./memory-nodes.service";
import {CardsCliService} from "./cards-cli.service";
import { PracticeItemsCliService } from "./practice-items-cli.service";
import {User} from "../classes/user";
import {ApiService} from "../interfaces/service-interfaces";
import {UsersApiCliService} from "./api/users-api-cli.service";

import { META_FILE, USERS_FILE } from "../constants/files.constant";
import {UsersService} from "./users.service";
import { MetaService } from "./meta.service";
import { MetaApiCliService } from "./api/meta-api-cli.service";

export class Container {
  memoryNodesService: IMemoryNodesService;
  cardsService: ICardsService;
  practiceItemsService: IPracticeItemsService;
  usersApiService: ApiService<User>;
  usersService: UsersService;
  metaService: MetaService;
  metaApiService: MetaApiCliService;
  private static instance: Container | null = null;

  private constructor() {
    this.memoryNodesService = new MemoryNodesCliService();
    this.cardsService = new CardsCliService();
    this.practiceItemsService = new PracticeItemsCliService();
    this.usersApiService = new UsersApiCliService(USERS_FILE);
    this.usersService = new UsersService();
    this.metaService = new MetaService();
    this.metaApiService = new MetaApiCliService(META_FILE);
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
export const USERS_SERVICE = SERVICE_CONTAINER.usersService;
export const META_SERVICE = SERVICE_CONTAINER.metaService;
export const META_API_SERVICE = SERVICE_CONTAINER.metaApiService;
