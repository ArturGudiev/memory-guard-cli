import {Card} from "../classes/card";
import {reactOnKeysPressed} from "./interaction.lib";
import {Subject} from "rxjs";
import {getRandomArrayElement} from "./utils/random.lib";

export function quiz(cards: Card[]) {

}

export interface ITestOptions {
  rightAnswersQuantity: number; // обычно 5, на сколько больше должно стать количество count, чтобы слово убрали из теста
}

export async function testCards(cards: Card[], options: ITestOptions = {rightAnswersQuantity: 5}): Promise<void> {
  // prepare originalCounts object
  // const isTestFinished = () => cards.every(card => isCardFinished(card));

  let previousCard: Card | null = null;
  const originalCounts: any = {}; // is needed to check difference
  cards.forEach(card => originalCounts[card._id] = card.count);

  const isCardFinished = (card: Card) => card.count - originalCounts[card._id] >= options.rightAnswersQuantity;
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

export interface IQuizState {
  originalCount: any;
  leftCardsNumber: number;
}

export async function testCard(card: Card, quizState: IQuizState | null = null) {
  const printCurrentQuestionFromScratch = () => {
    console.clear();
    card.printStats(quizState);
    card.printQuestion();
  };
  printCurrentQuestionFromScratch();
  let answerWasShowed = false;
  const exitSubject = new Subject<void>();
  await reactOnKeysPressed(
    {
      '1': () => {
        if ( !answerWasShowed ) {
          printCurrentQuestionFromScratch();
          card.printAnswer();
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

