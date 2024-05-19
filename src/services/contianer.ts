import {IPracticeItemsService} from "./service-interfaces";
import {MemoryNodesService} from "./instance-services/memory-nodes.service";
import {CardsService} from "./instance-services/cards.service";
import { PracticeItemsCliService } from "./api/cli/practice-items-cli.service";
import {User} from "../classes/user";
import {ApiService} from "../interfaces/service-interfaces";
import {UsersApiCliService} from "./api/cli/users-api-cli.service";

import { META_FILE, USERS_FILE } from "../constants/files.constant";
import {UsersService} from "./instance-services/users.service";
import { MetaService } from "./meta.service";
import { MetaApiCliService } from "./api/cli/meta-api-cli.service";
import { CardsApiMongoService } from "./api/mongo/cards-api-mongo.service";
import { Card, MemoryNode, PracticeItem } from "../classes";
import { MongoClient } from "mongodb";
import { MemoryNodesApiMongoService } from "./api/mongo/momery-nodes-api-mongo.service";
import { MetaApiMongoService } from "./api/mongo/meta-api-mongo.service";
import { UsersApiMongoService } from "./api/mongo/users-api-mongo.service";
import { PracticeItemsApiMongoService } from "./api/mongo/practice-items-api-mongo.service";
import { PracticeItemsService } from "./instance-services/practice-items";

const uri = "mongodb+srv://arturgudiev:arturgudievpwd@cluster0.5nqc5.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
const dbName = 'memory-guard-v2';
export const db = client.db(dbName);

export class Container {
  memoryNodesService: MemoryNodesService;
  cardsService: CardsService;
  practiceItemsService: PracticeItemsService;
  usersApiService: ApiService<User>;
  usersService: UsersService;
  metaService: MetaService;
  metaApiService: MetaApiMongoService;
  cardsApiService: ApiService<Card>;
  memoryNodesApiService: ApiService<MemoryNode>;
  practiceItemsApiService: PracticeItemsApiMongoService; //ApiService<PracticeItem>;
  private static instance: Container | null = null;

  private constructor() {
    const uri = "mongodb+srv://arturgudiev:arturgudievpwd@cluster0.5nqc5.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    const dbName = 'memory-guard-v2';
    const db = client.db(dbName);

    this.memoryNodesService = new MemoryNodesService();
    this.cardsService = new CardsService();
    this.practiceItemsService = new PracticeItemsService();
    this.usersApiService = new UsersApiMongoService(db, 'users');
    this.usersService = new UsersService();
    this.metaService = new MetaService();
    this.metaApiService = new MetaApiMongoService(db, 'meta');
    this.cardsApiService = new CardsApiMongoService(db, 'cards');
    this.memoryNodesApiService = new MemoryNodesApiMongoService(db, 'memory-nodes');
    this.practiceItemsApiService = new PracticeItemsApiMongoService(db, 'practice-items');
  }

  static getInstance(): Container {
    if (Container.instance === null) {
      Container.instance = new Container();
    }
    return Container.instance;
  }
}

export const SERVICE_CONTAINER = Container.getInstance();
export const MEMORY_NODES_SERVICE = SERVICE_CONTAINER.memoryNodesService;
export const CARDS_SERVICE = SERVICE_CONTAINER.cardsService;
export const PRACTICE_ITEMS_API_SERVICE = SERVICE_CONTAINER.practiceItemsApiService;
export const PRACTICE_ITEMS_SERVICE = SERVICE_CONTAINER.practiceItemsService;
export const USERS_API_SERVICE = SERVICE_CONTAINER.usersApiService;
export const USERS_SERVICE = SERVICE_CONTAINER.usersService;
export const META_SERVICE = SERVICE_CONTAINER.metaService;
export const META_API_SERVICE = SERVICE_CONTAINER.metaApiService;
export const CARDS_API_SERVICE = SERVICE_CONTAINER.cardsApiService;
export const MEMORY_NODES_API_SERVICE = SERVICE_CONTAINER.memoryNodesApiService;
