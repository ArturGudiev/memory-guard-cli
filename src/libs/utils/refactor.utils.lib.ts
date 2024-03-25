import { UsageType, Card } from "../../classes/card";
import { MEMORY_NODES_API_SERVICE, MEMORY_NODES_SERVICE } from "../../services/contianer";


async function setUsageTypeForAllCardsInNode(nodeId: number, usageType: UsageType) {
  const node = await MEMORY_NODES_API_SERVICE.getItem(nodeId);
  if (node) {
    const cards = await node.getCards(null);
    cards.forEach((card: Card) => {
      card.usageType = usageType;
      card.save();
    });
  }
}
