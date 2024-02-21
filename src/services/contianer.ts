import {ICardsService, IMemoryNodesService, IPracticeItemsService} from "./service-interfaces";
import {MemoryNodesCliService} from "./memory-nodes.service";
import {CardsCliService} from "./cards-cli.service";
import { PracticeItemsCliService } from "./practice-items-cli.service";

export class Container {
  memoryNodesService: IMemoryNodesService;
  cardsService: ICardsService;
  practiceItemsService: IPracticeItemsService;
  private static instance: Container | null = null;

  private constructor() {
    this.memoryNodesService = new MemoryNodesCliService();
    this.cardsService = new CardsCliService();
    this.practiceItemsService = new PracticeItemsCliService();
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
export const CARDS_SERVICE: ICardsService = SERVICE_CONTAINER.cardsService;
export const PRACTICE_ITEMS_SERVICE: IPracticeItemsService = SERVICE_CONTAINER.practiceItemsService;
