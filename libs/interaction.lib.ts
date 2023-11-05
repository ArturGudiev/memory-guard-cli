import readline from "readline";
import {firstValueFrom, fromEvent, map, Observable, Subject, take, takeUntil} from "rxjs";

const getKeyPressedObservable = (): [Observable<any>, Subject<any>] => {
  const destroy$ = new Subject();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });



  destroy$.pipe(take(1)).subscribe(() => {
    rl.close();
  });

  return [fromEvent(process.stdin, 'keypress').pipe(
    map((event: any) => event[0]),
    takeUntil(destroy$)
    // filter(name => name !== 'return') // Filter out the 'return' key if needed
  ), destroy$]
}



export async function reactOnKeysPressed(keyHandlers: {[key: string]: VoidFunction}, exitKeys = ['x'] ) {
  const [keyPressed$, destroy$] = getKeyPressedObservable();
  keyPressed$.subscribe(val => {
    if (exitKeys.includes(val)) {
      destroy$.next({});
    }
    if (['b'].includes(val)) {
      console.clear();
      console.log('you pressed b');
    }
    if (keyHandlers[val] !== undefined) {
      keyHandlers[val]();
    }
  })
  return firstValueFrom(destroy$);
}
