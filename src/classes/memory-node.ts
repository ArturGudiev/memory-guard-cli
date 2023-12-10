import {
    addNewMemoryNodesHandler,
    printMemoryNodesWithTitle,
    printParentsPath,
    selectCards,
} from "../libs/memory-nodes.lib";
import {isInRange, removeFirstWord} from "../libs/utils.lib";
import chalk from 'chalk';
import {CARDS_SERVICE, MEMORY_NODES_SERVICE} from "../services/contianer";
import {COLOR_LightBrown} from "../constants";
import {printCardsWithTitle, printStats} from "../libs/cards.lib";
import {quiz, testCards} from "../libs/quiz.lib";
import {ArgumentParser} from "argparse";
import {UsageType} from "./card";
import { exit, getUserInput, removeFirstArgument, waitForUserInput } from "ag-utils-lib";

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

    print(usageType: UsageType | null = null) {
        const cards = this.getCards(usageType);
        printParentsPath(this);
        console.log(chalk.hex(COLOR_LightBrown)(`\n\tMultiVerseNode-${this._id} ${this.name}`), chalk.greenBright(`  ( ${this.cards.length} [${cards.length}] ) \t Usage: ${usageType}\n`));
        printMemoryNodesWithTitle(this.getChildMemoryNodes());
        printStats(cards);
        printCardsWithTitle(cards)
        // const children = getNodeById();
        // console.log(`${JSON.stringify(this.childrenByHierarchies)} `);

    }

    async interactive() {
        let usageType: UsageType | null = null;
        while (true) {
            console.clear();
            this.print(usageType);
            const commandRaw = await getUserInput('Enter a command');
            const command = commandRaw.split(' ')[0];
            const commandArgs = removeFirstArgument(commandRaw.split(' '));
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
                continue;
            }
            if (command === 'x') {
                exit();
            }
            if (command === 'nav') {
                const id = +commandArgs[0];
                const node = MEMORY_NODES_SERVICE.getMemoryNodeById(id);
                node?.interactive();
                continue;
            }
            if (command === 'n+') {
                await addNewMemoryNodesHandler(this);
            }
            if (command === 'del') {
                const deleted = await deleteMemoryNodeHandler(this);
                continue;
            }
            if ( ['+', 'c+', 'c+!', 'card+'].includes(command) ) {
                const card = await CARDS_SERVICE.createInteractively(this,
                  { usageType, getQuestionTextInTerminal: command === 'c+!' });
                if (card) {
                    CARDS_SERVICE.addCard(card);
                    this.cards.push(card._id);
                    this.save();
                }
                await waitForUserInput();
            }
            if (['sel', 's'].includes(command)) {
                const cards = this.getCards(usageType);
                const selectedCards = selectCards(cards, commandArgs);
                console.log('============== ', selectedCards.length);
                console.log(selectedCards.map(c => `${c.getOneLineQuestion()} --- ${c.count}`));
                const additionalCommand = await getUserInput('Enter the command');
                if (additionalCommand.startsWith('q') || additionalCommand.startsWith('quiz')) {
                    const additionalCommandArgsString = removeFirstWord(additionalCommand);

                    const parser = new ArgumentParser({
                        description: 'Argparse example'
                    });
                    parser.add_argument('--count', {type: 'int'});
                    const args = parser.parse_args(additionalCommandArgsString.split(' '));
                    const options: any | null = {
                        rightAnswersQuantity: 5
                    };
                    if (args.count) {
                        options.rightAnswersQuantity = args.count;
                    }
                    await testCards(selectedCards, options);
                }
            }
            if (['us', 'usage'].includes(command)) {
                if (commandArgs.length === 0) {
                    continue;
                }
                switch (commandArgs[0]) {
                    case 'a':
                        usageType = 'active';
                        break;
                    case 'p':
                        usageType = 'passive';
                        break;
                    case 't':
                        usageType = 'transitional';
                        break;
                    case 'c':
                    case 'd':
                        usageType = 'common';
                        break;
                    case 'n':
                        usageType = null;
                        break;
                }
            }
            if ( ['sc'].includes(command) ) {

            }
            if (['x'].includes(command)) {
                exit();
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

    getCards(usage: UsageType | null = null) {
        const cards = CARDS_SERVICE.getCardsByIDs(this.cards);
        return usage === null ? cards : cards.filter(card => card.usageType === usage);
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
