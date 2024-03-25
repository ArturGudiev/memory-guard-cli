import { exit, getUserInput, getUserInputUnicode, selectIndexFromList, waitForUserInput } from "ag-utils-lib";
import { ArgumentParser } from "argparse";
import chalk from 'chalk';
import { isNil } from "lodash";
import { COLOR_LightBrown } from "../constants";
import { printCardsWithTitle, printStats } from "../libs/cards.lib";
import {
    addNewMemoryNodesHandler,
    printMemoryNodesWithTitle,
    printParentsPath,
    selectCards,
} from "../libs/memory-nodes.lib";
import { ITestOptions, practiceTestCards, testCards } from "../libs/quiz.lib";
import { isInRange, removeFirstWord } from "../libs/utils.lib";
import { selectSymbolInString } from "../libs/utils/mg-utils";
import {
    CARDS_API_SERVICE,
    CARDS_SERVICE,
    MEMORY_NODES_API_SERVICE,
    MEMORY_NODES_SERVICE
} from "../services/contianer";
import { Card, UsageType } from "./card";
import { CardItem } from "./card-items/card-item";
import { TextCardItem } from "./card-items/text-card-item";
import { TextWithHighlightedSymbolCardItem } from "./card-items/text-with-highlighted-symbol";
import { getActionByCommand, printObjectsList, splitOnFirstWordAndArguments } from "../libs/utils-to-lib";

const  MEMORY_NODE_INTERACTIVE_ACTIONS_MAP = {
    UP: ['u'],
    EXIT: ['x', 'exit'],
    NAVIGATE: ['nav'],
    ADD_MEMORY_NODE: ['n+', 'node+'],
    DELETE: ['del', 'delete'],
    CHANGE_FIELD: ['cf', 'change_field'],
    ADD_CARD: ['+', 'c+', 'c+!', 'card+'],
    ADD_WORD_WITH_STRESS: ['sc_s', 'scs', 'ысы'],
    ADD_SEVERAL_WORDS_WITH_STRESS: ['scs2', 'ысы2'],
    ADD_TEXT_ITEMS: ['tt', 'ее'],
    SELECT_CARD: ['selc'],
    APPEND_ALIAS: ['apal'],
    SELECT_CARDS: ['sel', 's'],
    SET_USAGE_TYPE: ['us', 'usage'],
    ADD_PRIORITY: ['p+', 'add_priority'],
    SELECT_PRIORITY: ['sp', 'select_priority'],
    REMOVE_PRIORITY: ['rp', 'remove_priority'],
}

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
        const parents = await nodeToDelete.getParents();
        parents.forEach((parent: MemoryNode) => {
            parent.children = parent.children.filter(id => id !== nodeToDelete._id);
        });
        await MEMORY_NODES_API_SERVICE.deleteItem(nodeToDelete);
        await goToParentHandler(nodeToDelete);
    }
    return answer === 'y';
}

async function goToParentHandler(node: MemoryNode) {
    const parent = await MEMORY_NODES_API_SERVICE.getItem(node.parents[0]);
    if (parent) {
        await parent.interactive();
    }
}

export interface CardsPriority {
    name: string;
    number: number;
    cards: number[];
}

export class MemoryNode {
    _id: number;
    name: string;
    children: number[] = [];
    parents: number[] = [];
    cards: number[] = [];
    aliases: string[] = [];
    priorities: CardsPriority[] = [];
    // views versions verse hierarchy
    
    constructor(_id: number, name: string, children: number[], parents: number[], memoryItems: number[],
                aliases: string[], priorities: CardsPriority[]) {
        this._id = _id;
        this.name = name;
        this.children = children;
        this.parents = parents;
        this.cards = memoryItems;
        this.aliases = aliases;
        this.priorities = priorities;
    }

    createChildNode() {}

    static createFromObj(obj: MemoryNode): MemoryNode {
        return new MemoryNode(obj._id, obj.name, obj.children, obj.parents, obj.cards, obj.aliases, obj.priorities ?? []);
    }

    async save(): Promise<void> {
        await MEMORY_NODES_API_SERVICE.updateItem(this);
    }

    async getChildMemoryNodes(): Promise<MemoryNode[]> {
        return await MEMORY_NODES_API_SERVICE.getItems(this.children);
    }

    getParents(): Promise<MemoryNode[]> {
        return MEMORY_NODES_API_SERVICE.getItems(this.parents);
    }

    async print(usageType: UsageType | null = null, field: "count" | "practiceCount" = 'count', priority: CardsPriority | null) {
        console.log('print', field)
        const cards = await this.getCards(usageType, priority);
        await printParentsPath(this);
        const aliasesPart = isNil(this.aliases) ? '' : `\t\t${this.aliases}`;
        console.log(chalk.hex(COLOR_LightBrown)(`\n\tMultiVerseNode-${this._id} ${this.name}`), chalk.greenBright(`  ( ${this.cards.length} [${cards.length}] ) \t Usage: ${usageType}`
            + aliasesPart + '\n'
        ));

        if (!priority) {
            printObjectsList('Priorities', this.priorities, p => `${p.number} ${p.name} ${p.cards.length}`);
        } else {
            console.log('\tPriority', priority.name, priority.number )
        }
        const nodes = await this.getChildMemoryNodes();
        printMemoryNodesWithTitle(nodes);
        printStats(cards, field);
        // printCardsWithTitle(cards.slice(0, 20))
        printCardsWithTitle(cards)
        // const children = getNodeById();
        // console.log(`${JSON.stringify(this.childrenByHierarchies)} `);

    }

    async interactive() {
        let usageType: UsageType | null = null;
        let priority: CardsPriority | null = null;
        let field: 'count' | 'practiceCount' = 'count'
        while (true) {
            console.clear();
            await this.print(usageType, field, priority);
            const val = await getUserInputUnicode('Enter memory node command');
            const [command, args] = splitOnFirstWordAndArguments(val);

            // const commandRaw = await getUserInputUnicode('Enter a command');
            // const commandRaw = await getUserInput('Enter a command');
            // const command = commandRaw.split(' ')[0];
            // const commandArgs = removeFirstArgument(commandRaw.split(' '));
            if (!command) {
                continue;
            }
            const action = getActionByCommand(MEMORY_NODE_INTERACTIVE_ACTIONS_MAP, command);
            if (!action) {
                if (Number.isInteger(Number(command))) {
                    const index = Number(command) - 1;
                    if (!isInRange(index, '[', 0, this.children.length, ')')) {
                        continue;
                    }
                    const child = await MEMORY_NODES_API_SERVICE.getItem(this.children[index]);
                    if (child) {
                        await child.interactive();
                    }
                    continue;
                }
            }
            switch (action) {
                case "REMOVE_PRIORITY":
                    priority = null;
                    break;
                case 'ADD_PRIORITY':
                    await this.addPriorityHandler();
                    break;
                case 'UP':
                    if (this.parents.length === 0) {
                        continue;
                    }
                    await goToParentHandler(this);
                    break;
                case 'SELECT_PRIORITY':
                    priority = await this.selectPriorityHandler() ?? null;
                    break;
                case 'EXIT':
                    exit();
                    break;
                case 'NAVIGATE':
                    const id = +args[0];
                    const node = await MEMORY_NODES_API_SERVICE.getItem(id);
                    await node?.interactive();
                    break;
                case 'ADD_MEMORY_NODE':
                    await addNewMemoryNodesHandler(this);
                    break;
                case 'DELETE':
                    await deleteMemoryNodeHandler(this)
                    break;
                case 'CHANGE_FIELD':
                    field = field === 'count' ? 'practiceCount' : 'count'
                    break;
                case 'ADD_CARD':
                    const card = await CARDS_SERVICE.createInteractively(this,
                      { usageType, getQuestionTextInTerminal: command === 'c+!' });
                    if (card) {
                        CARDS_API_SERVICE.addItem(card);
                        this.cards.push(card._id);
                        if (priority) {
                            priority.cards.push(card._id);
                        }
                        await this.save();
                    }
                    await waitForUserInput();
                    break;
                case 'ADD_WORD_WITH_STRESS':
                    await this.scriptAddWordWithStress(usageType, args);
                    break;
                case 'ADD_SEVERAL_WORDS_WITH_STRESS':
                    await this.scriptAddSeveralWordsWithStress(usageType, args);
                    break;
                case 'ADD_TEXT_ITEMS':
                    await this.scriptAddTextItems(usageType);
                    break;
                case 'SELECT_CARD':
                    const cards = await this.getCards(usageType, priority);
                    const index = await selectIndexFromList(cards.map((c: Card) => c.getOneLineQuestion()));
                    const selectedCard = cards[index];
                    await selectedCard.interactive();
                    break;
                case 'APPEND_ALIAS':
                    args.forEach(async (alias) => {
                        const isAliasUsed = await MEMORY_NODES_SERVICE.isAliasUsed(alias);
                        if (isAliasUsed) {
                            waitForUserInput(`Can't add already existing alias`);
                        } else {
                            this.aliases.push(alias);
                        }
                    });
                    await this.save();
                    break;
                case 'SELECT_CARDS':
                    // selects items and stores them in selectedCard local variable
                    const cardsByUsageType = await this.getCards(usageType, priority);
                    const selectedCards = selectCards(cardsByUsageType, args);
                    console.log('============== ', selectedCards.length);
                    console.log(selectedCards.map(c => `${c.getOneLineQuestion()} --- ${c.count}`));
                    // printCardsArray(selectedCards);
                    const additionalCommand = await getUserInput('Enter the command');
                    if (additionalCommand.startsWith('q') || additionalCommand.startsWith('quiz')) {
                        const additionalCommandArgsString = removeFirstWord(additionalCommand);

                        const parser = new ArgumentParser({
                            description: 'Argparse example'
                        });
                        parser.add_argument('--count', {type: 'int'});
                        parser.add_argument('--until', {type: 'int'});
                        const args = parser.parse_args(additionalCommandArgsString.split(' '));
                        let options: ITestOptions = {};
                        if (args.count) {
                            options.rightAnswersQuantity = args.count;
                        }
                        if (args.until) {
                            options.until = args.until;
                        }
                        if (!options) {
                            options = {rightAnswersQuantity: 5}
                        }
                        await testCards(selectedCards, options);
                    }

                    if (additionalCommand.startsWith('pq') || additionalCommand.startsWith('pquiz') || additionalCommand.startsWith('practice-quiz')) {
                        const additionalCommandArgsString = removeFirstWord(additionalCommand);

                        const parser = new ArgumentParser({
                            description: 'Argparse example'
                        });
                        parser.add_argument('--count', {type: 'int'});
                        parser.add_argument('--until', {type: 'int'});
                        const args = parser.parse_args(additionalCommandArgsString.split(' '));
                        let options: ITestOptions = {};
                        if (args.count) {
                            options.rightAnswersQuantity = args.count;
                        }
                        if (args.until) {
                            options.until = args.until;
                        }
                        if (!options) {
                            options = {rightAnswersQuantity: 5}
                        }
                        await practiceTestCards(selectedCards, options);
                    }
                    break;
                case 'SET_USAGE_TYPE':
                    if (args.length === 0) {
                        continue;
                    }
                    switch (args[0]) {
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
                    break;
            }
        }

    }

    private async selectPriorityHandler(): Promise<CardsPriority | undefined> {
        const index = await selectIndexFromList(this.priorities.map(e => `${e.number} ${e.name} (${e.cards.length} card[s])`));
        return this.priorities[index];
    }
    async scriptAddTextItems(usageType: string | null) {
        const input = await getUserInputUnicode('Enter 2 items separated by =');
        const items = input.split('=');
        const question = [new TextCardItem(items[0])];
        const answer = [new TextCardItem(items[1])];
        const card = await CARDS_SERVICE.createCardByQuestionAndAnswer(
            this,
            question,
            answer,
            { usageType}
          );
          CARDS_API_SERVICE.addItem(card);
          this.cards.push(card._id);
          await this.save();
        
    }

    async getCards(usage: UsageType | null = null, priority: CardsPriority | null = null): Promise<Card[]> {
        const cards = await CARDS_API_SERVICE.getItems(priority ? priority.cards : this.cards);
        return usage === null ? cards : cards.filter((card: Card) => card.usageType === usage);
    }

    private async scriptAddWordWithStress(usageType: UsageType | null, args: string[]): Promise<void> {
        const word = args.length === 0 ? await getUserInputUnicode('Enter a word') : args.join(' ');
        if (!word) {
            // continue;
            return;
        }
        const textItem = new TextCardItem(word);
        const index = await selectSymbolInString(word);
        if (index === null) {
            // continue;
            return;
        }
        const textWithSymbolItem = new TextWithHighlightedSymbolCardItem(word, index);
        const card = await CARDS_SERVICE.createCardByQuestionAndAnswer(
          this,
          [textItem],
          [textWithSymbolItem],
          { usageType}
        );
        await CARDS_API_SERVICE.addItem(card);
        this.cards.push(card._id);
        await this.save();
    }

    private async scriptAddSeveralWordsWithStress(usageType: null | UsageType, args: string[]) {
        let words: string[] = [];
        if (args.length === 0) {
            const wordsString = await getUserInputUnicode('Enter a words with space');
            if (!wordsString) {
                return;
            }
            words = wordsString.split(' ');
        } else {
            words = args;
        }
        const questionString = words.join('\n');
        const textItem = new TextCardItem(questionString);
        const answerArray: CardItem[] = [];
        for (const word of words) {
            const index = await selectSymbolInString(word);
            if (index === null) {
                // continue;
                return;
            }
            const textWithSymbolItem = new TextWithHighlightedSymbolCardItem(word, index);
            answerArray.push(textWithSymbolItem);
        }
        const card = await CARDS_SERVICE.createCardByQuestionAndAnswer(
          this,
          [textItem],
          answerArray,
          { usageType}
        );
        await CARDS_API_SERVICE.addItem(card);
        this.cards.push(card._id);
        await this.save();
    }

    private async addPriorityHandler() {
        const numberInput = await getUserInput('Enter number (Use unique)');
        if (!Number.isInteger(+numberInput) || this.priorities.map(el => el.number).includes(+numberInput)) {
            return;
        }
        const name = await getUserInput('Enter name');
        const nodePriority: CardsPriority = {
            name,
            number: +numberInput,
            cards: []
        }
        this.priorities.push(nodePriority);
        this.priorities = this.priorities.sort((x, y) => x.number - y.number);
        await this.save();
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
