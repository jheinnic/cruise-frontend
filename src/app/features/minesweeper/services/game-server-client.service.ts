import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {BeginNewGame, EndCurrentGame, MinesweeperActions, MinesweeperActionTypes} from '../store/minesweeper.actions';
import {merge, Observable, ObservableInput, Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {State} from '../store/minesweeper.reducer';
import {switchMap, takeUntil} from 'rxjs/operators';

@Injectable()
export class GameServerClient {

  public constructor(
    private readonly store: Store<State>,
    private readonly actions: Actions<MinesweeperActions>) {

  }

  private ingress: Subject<MinesweeperActions> = new Subject<MinesweeperActions>();

  @Effect({dispatch: true})
  public readonly commandTap: Observable<MinesweeperActions> =
    this.actions.pipe(
      ofType(MinesweeperActionTypes.BeginNewGame),
      switchMap(
        (_action: BeginNewGame, _index: number): ObservableInput<MinesweeperActions> => {
          return this.ingress.asObservable().pipe(
            takeUntil(
              merge(
                this.actions.pipe(
                  ofType(MinesweeperActionTypes.ReportPlayerLoses)
                ),
                this.actions.pipe(
                  ofType(MinesweeperActionTypes.ReportPlayerWins)
                ),
                this.actions.pipe(
                  ofType(MinesweeperActionTypes.EndCurrentGame)
                )
              )
            )
          );
        }
      )
    );

  cancelGame(): void
  {
    this.ingress.next(
      new EndCurrentGame()
    );
  }
}
