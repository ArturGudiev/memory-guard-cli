import {MEMORY_NODES_SERVICE} from "./services/contianer";

async function temp() {
  const node = MEMORY_NODES_SERVICE.getMemoryNodeById(1)
  if (node) {
    await node.interactive();
  }
}


async function main() {
  await temp();
}

main().then(r => r);
