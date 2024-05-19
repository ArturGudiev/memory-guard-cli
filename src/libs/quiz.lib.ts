import {Card} from "../classes/card";
import {reactOnKeysPressed} from "./interaction.lib";
import {BehaviorSubject, Subject} from "rxjs";
import {getRandomArrayElement} from "./utils/random.lib";
import { inTag } from "./utils/browser.utils";
import {isNil} from "lodash";
import { PRACTICE_ITEMS_API_SERVICE, PRACTICE_ITEMS_SERVICE } from "../services/contianer";
import { PracticeItem } from "../classes/practice-item";
import { getInputFromEditor, getUserInputUnicode, waitForUserInput } from "ag-utils-lib";
import { getInput } from "./utils.lib";

export function quiz(cards: Card[]) {

}

export interface ITestOptions {
  rightAnswersQuantity?: number; // обычно 5, на сколько больше должно стать количество count, чтобы слово убрали из теста
  until?: number; // обычно 5, на сколько больше должно стать количество count, чтобы слово убрали из теста
}

export async function testCards(cards: Card[], options: ITestOptions = {rightAnswersQuantity: 5}): Promise<void> {1

  let previousCard: Card | null = null;
  const originalCounts: any = {}; // is needed to check difference
  cards.forEach(card => originalCounts[card._id] = card.count);

  const isCardFinished = (card: Card) => {
    if (!isNil(options.rightAnswersQuantity)) {
      return card.count - originalCounts[card._id] >= options.rightAnswersQuantity;
    }
    if (!isNil(options.until)) {
      return card.count >= options.until;
    }
  };
  const hasUnfinishedCard = () => cards.some(card => !isCardFinished(card));

  const getUnfinishedCards = () => {
    return cards.filter(card => !isCardFinished(card));
  }

  const getNextUnfinishedCard = () => {
    const unfinishedCards = getUnfinishedCards();
    return getRandomArrayElement<Card>(
      unfinishedCards.length > 1
        ? unfinishedCards.filter(card => card !== previousCard)
        : unfinishedCards
    );
  };
  const getQuizState = (card: Card): IQuizState => ({
    leftCardsNumber: getUnfinishedCards().length,
    originalCount: originalCounts[card._id]
  });
  while (hasUnfinishedCard()) {
    const cardToTest = getNextUnfinishedCard();
    previousCard = cardToTest;
    await testCard(cardToTest, getQuizState(cardToTest));
  }
}


export async function practiceTestCards(cards: Card[], options: ITestOptions = {rightAnswersQuantity: 5}): Promise<void> {
  let previousCard: Card | null = null;
  const originalCounts: any = {}; // is needed to check difference
  cards.forEach(card => originalCounts[card._id] = card.practiceCount);

  const isCardFinished = (card: Card) => {
    if (!isNil(options.rightAnswersQuantity)) {
      return card.practiceCount - originalCounts[card._id] >= options.rightAnswersQuantity;
    }
    if (!isNil(options.until)) {
      return card.practiceCount >= options.until;
    }
  };
  const hasUnfinishedCard = () => cards.some(card => !isCardFinished(card));

  const getUnfinishedCards = () => {
    return cards.filter(card => !isCardFinished(card));
  }

  const getNextUnfinishedCard = () => {
    const unfinishedCards = getUnfinishedCards();
    return getRandomArrayElement<Card>(
      unfinishedCards.length > 1
        ? unfinishedCards.filter(card => card !== previousCard)
        : unfinishedCards
    );
  };
  const getQuizState = (card: Card): IQuizState => ({
    leftCardsNumber: getUnfinishedCards().length,
    originalCount: originalCounts[card._id]
  });

  while (hasUnfinishedCard()) {
    const cardToTest = getNextUnfinishedCard();
    previousCard = cardToTest;
    let practiceItem = await PRACTICE_ITEMS_API_SERVICE.getPracticeItemByCardId(cardToTest._id);
    if (!practiceItem) {
      practiceItem = await PRACTICE_ITEMS_SERVICE.createPracticeItemForCard(cardToTest._id);
    }
    await practiceTestCard(cardToTest, practiceItem, getQuizState(cardToTest));
  }
}

export interface IQuizState {
  originalCount: any;
  leftCardsNumber: number;
}

export async function testCard(card: Card, quizState: IQuizState | null = null) {
  const printCurrentQuestionFromScratch = async () => {
    console.clear();
    card.printStats(quizState);
    await card.printQuestion();
  };
  printCurrentQuestionFromScratch();
  let answerWasShowed = false;
  const exitSubject = new Subject<void>();
  await reactOnKeysPressed(
    {
      '1': async () => {
        if ( !answerWasShowed ) {
          await printCurrentQuestionFromScratch();
          await card.printAnswer();
          answerWasShowed = true;
        } else {
          card.increaseCount();
          exitSubject.next();
        }
      },
      '2': () => {
        card.decreaseCount();
        exitSubject.next();
      },
      '5': () => {
        card.increaseCount();
        exitSubject.next();
      }
    },
    ['x'],
    exitSubject
  );
}

export async function practiceTestCard(card: Card, practiceItem: PracticeItem, quizState: IQuizState | null = null) {
  const printCardFromScratch = () => {
    console.clear();
    card.printPracticeStats(quizState);
    card.printQuestion();
    card.printAnswer();
  };
  const printCardWithBaseExamplesFromScratch = () => {
    printCardFromScratch();
    console.log(practiceItem.baseExamples);
  }
  const printCardWithAllExamplesFromScratch = () => {
    printCardFromScratch();
    console.log(practiceItem.baseExamples);
    console.log(practiceItem.examples);
  }
  
  printCardFromScratch();
  let baseExamplesWereShown = false;
  let allExamplesWereShown = false;
  const exitSubject = new Subject<void>();
  const ignoreSubject = new BehaviorSubject<boolean>(false);
  await reactOnKeysPressed(
    {
      '1': async () => {
        if ( !baseExamplesWereShown ) {
          printCardWithBaseExamplesFromScratch();
          baseExamplesWereShown = true;
        } else if (!allExamplesWereShown) {
          printCardWithAllExamplesFromScratch();
          allExamplesWereShown = true;
        } else {
          card.increasePracticeCount();
          exitSubject.next();
        }
      },
      '2': () => {
        card.decreasePracticeCount();
        exitSubject.next();
      },
      '8': async () => {
        ignoreSubject.next(true);
        let input: string = await getInputFromEditor('Enter a base example sentence');
        input = input.replaceAll('ӕ', 'æ')
        practiceItem.baseExamples.push(input);
        practiceItem.save();
        if ( allExamplesWereShown ) {
          printCardWithAllExamplesFromScratch();
        } else {
          printCardWithBaseExamplesFromScratch();
        }
        ignoreSubject.next(false);
      },
      '9': async () => {
        ignoreSubject.next(true);
        let input = await getInputFromEditor('Enter a base example sentence');
        input = input.replaceAll('ӕ', 'æ')
        practiceItem.examples.push(input);
        await waitForUserInput();
        practiceItem.save();
        ignoreSubject.next(false);
        printCardWithAllExamplesFromScratch();
      },
      '5': () => {
        card.increasePracticeCount();
        exitSubject.next();
      }
    },
    ['x'],
    exitSubject,
    ignoreSubject
  );
}


export function showCardInBrowser(card: Card): void {
  const html = `
  ${inTag('Question')}
  ${card.getQuestionHTML()}
  ${inTag('Answer')}
  ${card.getAnswerHTML()}
  `
}
