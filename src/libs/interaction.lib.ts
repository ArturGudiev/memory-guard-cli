import readline from "readline";
import {BehaviorSubject, filter, firstValueFrom, fromEvent, map, Observable, Subject, take, takeUntil} from "rxjs";

const getKeyPressedObservable = (): [Observable<any>, Subject<void>] => {
  const destroy$ = new Subject<void>();
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



export async function reactOnKeysPressed(
  keyHandlers: {[key: string]: VoidFunction},
  exitKeys = ['x'],
  exitSubject= new Subject<void>(),
  ignoreSubject = new BehaviorSubject<boolean>(false)) {
  const [keyPressed$, destroy$] = getKeyPressedObservable();
  exitSubject
    .pipe(take(1))
    .subscribe(() => destroy$.next());

  keyPressed$
    .pipe(
      filter(() => !ignoreSubject.value)
    )
    .subscribe(async (val) => {
      if (exitKeys.includes(val)) {
        destroy$.next();
      }
      if (['b'].includes(val)) {
        console.clear();
        console.log('you pressed b');
      }
      if (keyHandlers[val] !== undefined) {
        await keyHandlers[val]();
      } else {
        console.log('some key', val);
      }
    })
  return firstValueFrom(destroy$);
}
