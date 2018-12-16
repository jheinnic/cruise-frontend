import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';

import * as fromStore from './store/reducers/minesweeper.reducer';
import {GameBoardCell} from './store/models/minesweeper.models';

@Component({
  selector: 'cai-minesweeper',
  templateUrl: './minesweeper.component.html',
  styleUrls: ['./minesweeper.component.css']
})
export class MinesweeperComponent implements OnInit, OnDestroy
{
  public readonly boardState: Observable<GameBoardCell[]>;
  public gameInProgress: boolean;
  public boardStateValue: GameBoardCell[];
  public boardStateSubscription: Subscription;

  constructor(private store: Store<fromStore.State>)
  {
    this.boardState = this.store.select(
      fromStore.allSelectors.selectBoardState);
  }

  ngOnInit()
  {
    this.boardStateSubscription = this.boardState.subscribe(
      (value: GameBoardCell[]) => {
        this.boardStateValue = value;
        this.gameInProgress = !(!value || (value.length === 0));
      }
    );
  }

  ngOnDestroy()
  {
    this.boardStateSubscription.unsubscribe();
  }
}
