import { UsageType, Card } from "../../classes/card";
import { MEMORY_NODES_SERVICE } from "../../services/contianer";


function setUsageTypeForAllCardsInNode(nodeId: number, usageType: UsageType) {
  const node = MEMORY_NODES_SERVICE.getMemoryNodeById(nodeId);
  if (node) {
    const cards = node.getCards();
    cards.forEach((card: Card) => {
      card.usageType = usageType;
      card.save();
    });
  }
}
