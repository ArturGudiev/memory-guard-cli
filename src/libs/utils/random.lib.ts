// export function getRandomNumber() {
//   Math.random();
// }

import {random} from "lodash";

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function getRandomArbitrary(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomArrayElement<T>(arr: Array<T>): T {
  const index = random(0, arr.length - 1);
  return arr[index];
}
export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
