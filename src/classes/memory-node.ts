import {addNewMemoryNodesHandler, printMemoryNodesWithTitle, selectCards,} from "../libs/memory-nodes.lib";
import {exit, getUserInput, isInRange, removeFirstArgument, waitForUserInput} from "../libs/utils.lib";
import chalk from 'chalk';
import {CARDS_SERVICE, MEMORY_NODES_SERVICE} from "../services/contianer";
import {COLOR_LightBrown} from "../constants";
import {printCardsWithTitle} from "../libs/cards.lib";

// export class MemoryNode {
//     root: MemoryNode | null = null;
// }

export type NodeChildren = {[key: string]: number[]};

function printHierarchiesWithNames(childrenByHierarchies: any, selected: number | null = null) {
    const hierarchies = Object.keys(childrenByHierarchies);
    if (hierarchies.length > 0) {
        console.log();
        console.log('\t------Hierarchies------');
        console.log();
        hierarchies.forEach((hierarchy, i: number) => {
            if (selected !== null && selected === i) {
                console.log(chalk.red(`\t${i + 1}. ${hierarchy}`));
            } else {
                console.log(chalk.green(`\t${i + 1}. ${hierarchy}`));
            }
        });
        console.log();
    }
}

async function deleteMemoryNodeHandler(nodeToDelete: MemoryNode): Promise<boolean> {
    const answer = await getUserInput('Do you really want to delete it ');
    if (answer === 'y') {
        nodeToDelete.getParents().forEach((parent: MemoryNode) => {
            parent.children = parent.children.filter(id => id !== nodeToDelete._id);
        });
        MEMORY_NODES_SERVICE.deleteMemoryNode(nodeToDelete);
        await goToParentHandler(nodeToDelete);
    }
    return answer === 'y';
}

async function goToParentHandler(node: MemoryNode) {
    const parent = MEMORY_NODES_SERVICE.getMemoryNodeById(node.parents[0]);
    if (parent) {
        await parent.interactive();
    }
}

export class MemoryNode {
    _id: number;
    name: string;
    children: number[] = [];
    parents: number[] = [];
    cards: number[] = [];
    // views versions verse hierarchy
    
    constructor(_id: number, name: string, children: number[], parents: number[], memoryItems: number[]) {
        this._id = _id;
        this.name = name;
        this.children = children;
        this.parents = parents;
        this.cards = memoryItems;
    }

    createChildNode() {}

    static createFromObj(obj: MemoryNode): MemoryNode {
        return new MemoryNode(obj._id, obj.name, obj.children, obj.parents, obj.cards);
    }

    save(): void {
        MEMORY_NODES_SERVICE.updateMemoryNode(this);
    }

    getChildMemoryNodes(): MemoryNode[] {
        return MEMORY_NODES_SERVICE.getMemoryNodesByIDs(this.children);
    }

    getParents(): MemoryNode[] {
        return MEMORY_NODES_SERVICE.getMemoryNodesByIDs(this.parents);
    }

    print() {
        console.log(chalk.hex(COLOR_LightBrown)(`\n\tMultiVerseNode-${this._id} ${this.name}`), chalk.greenBright(`  ( ${this.cards.length} )\n`));
        // printMemoryNodesWithTitle();
        printMemoryNodesWithTitle(this.getChildMemoryNodes());
        printCardsWithTitle(this.getCards())
        // const children = getNodeById();
        // console.log(`${JSON.stringify(this.childrenByHierarchies)} `);

    }

    async interactive() {
        while (true) {
            console.clear();
            this.print();
            const command = await getUserInput('Enter a command');
            const commandArgs = removeFirstArgument(command.split(' '));
            if (!command) {
                continue;
            }
            if (Number.isInteger(Number(command))) {
                const index = Number(command) - 1;
                if (!isInRange(index, '[', 0, this.children.length, ')')) {
                    continue;
                }
                const child = MEMORY_NODES_SERVICE.getMemoryNodeById(this.children[index]);
                if (child) {
                    await child.interactive();
                }
            }
            if (command === 'u') {
                if (this.parents.length === 0) {
                    continue;
                }
                await goToParentHandler(this);
            }
            if (command === 'x') {
                exit();
            }
            if (command === 'n+') {
                await addNewMemoryNodesHandler(this);
            }
            if (command === 'del') {
                const deleted = await deleteMemoryNodeHandler(this);
                continue;
            }
            if ( ['+', 'c+', 'card+'].includes(command) ) {
                const card = await CARDS_SERVICE.createInteractively(this);
                if (card) {
                    card.parentNodes = [this._id];
                    this.cards.push(card._id);
                    CARDS_SERVICE.addCard(card);
                    this.save();
                }
                await waitForUserInput();
            }
            if (['sel', 's'].includes(command)) {
                const cards = this.getCards();
                const selectedCards = selectCards(cards, commandArgs);
            }


            // if (command[0] === 'h') {
            //     const secondPart = command.substring(1);
            //     if (Number.isInteger(Number(secondPart))) {
            //         selectedHierarchy = Number(secondPart) - 1;
            //         continue;
            //     }
            // }
            // if (command.length > 0) {
            //
            // }
        }

    }

    private getCards() {
        return CARDS_SERVICE.getCardsByIDs(this.cards);
    }
}


// 1 share things 
// hierarchies are not intersected 

// actions to implements 
/**
 * go down by hierarchy
 * go up by hierarchy
 * select hierarchy 
 * 
 */