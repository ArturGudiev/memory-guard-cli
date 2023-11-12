import {ICardsService, IMemoryNodesService} from "./service-interfaces";
import {MemoryNodesCliService} from "./memory-nodes.service";
import {CardsCliService} from "./cards-cli.service";

export class Container {
  public memoryNodesService: IMemoryNodesService;
  public cardsService: ICardsService;
  private static instance: Container | null = null;

  private constructor() {
    this.memoryNodesService = new MemoryNodesCliService();
    this.cardsService = new CardsCliService();
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
