import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';

import * as fromStore from '../store/minesweeper.reducer';
import {PlayNextMove} from '../store/minesweeper.actions';
import {GameBoardCell, LatestOutcome} from '../store/minesweeper.models';
import {PlayerStatus} from '../dto/replies/player-status.enum';
import {GameState} from '../store/minesweeper.reducer';
import {Observable, Subscription} from 'rxjs';
import * as util from 'util';

@Component({
  selector: 'cai-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit, OnDestroy
{
  private static readonly CELL_SCALES = [24, 32, 48, 64];

  public readonly boardState: Observable<GameBoardCell[]>;
  public readonly xSize: Observable<number>;

  @ViewChild('gameBoard', {read: ElementRef}) private _gameBoard: ElementRef<any>;

  private readonly _sizes: Partial<{
    xSize: number,
    containerWidth: number,
    containerOWidth: number,
    idealCellWidth: number,
    idealCellOWidth: number,
    actualCellWidth: number
    actualBoardWidth: number;
  }>;
  private xSubscription: Subscription;

  constructor(private store: Store<fromStore.State>)
  {
    this.boardState = this.store.select(fromStore.selectBoardState);
    this.xSize = this.store.select(fromStore.selectXSize);

    this._sizes = {
      actualCellWidth: 48,
      actualBoardWidth: 144
    };

    // Stash a one-time copy of the new-game properties that are expected to
    // remain fixed in out lifetime.
    // this.newGameSubscription = this.store.select(
    //   fromStore.selectNewGameProps
    // ).subscribe((value) => {
    //   this.xSize = value.xSize;
    //   this.ySize = value.ySize;
    //   this.mineCount = value.mineCount;
    // });

    // Subscribe to the outcome state and the game state Enum on an ongoing basis
    // to keep those UI details live.
    // this.outcomeSubscription = this.store.select(
    //   fromStore.selectGameProgress
    // ).subscribe(
    //   (value: LatestOutcome) => {
    //     console.log('Replacing last outcome with', JSON.stringify(value));
    //     this.latestOutcome = value;
    //   }
    // );
    // this.gameStateSubscription = this.store.select(
    //   fromStore.selectGameState
    // ).subscribe(
    //   (value: GameState) => {
    //     this.gameState = value;
    //   }
    // );
  }

  ngOnInit()
  {
    this.xSubscription = this.xSize.subscribe((value: number) => {
      this._sizes.xSize = value;
      this.validateBoardSizing();
    });

    this.store.select(
      fromStore.selectNextTurnId
    )
  }

  ngOnDestroy() {
    this.xSubscription.unsubscribe();
  }

  public get cellHeight(): number {
    return this._sizes.actualCellWidth;
  }

  public get boardWidth(): number {
    return this._sizes.actualBoardWidth;
  }

  validateBoardSizing() {
    if (!! this._gameBoard) {
      const xCount = this._sizes.xSize;

      this._sizes.containerWidth = this._gameBoard.nativeElement.parent.offsetWidth;
      this._sizes.idealCellWidth = this._gameBoard.nativeElement.parent.offsetWidth / xCount;

      const compatible = GameBoardComponent.CELL_SCALES.filter(
        (cellScale: number) => cellScale <= this._sizes.idealCellWidth );

      if (! compatible.length) {
        this._sizes.actualCellWidth = GameBoardComponent.CELL_SCALES[0];
        console.warn(
          `Smallest cell size exceeds overflow threshold by ${GameBoardComponent.CELL_SCALES[0] - this._sizes.idealCellWidth}`);
      } else {
        this._sizes.actualCellWidth = compatible.pop();
      }

      this._sizes.actualBoardWidth = this._sizes.actualCellWidth * xCount;
      console.log(JSON.stringify(this._sizes));
    }
  }

  moveHere(xCell: number, yCell: number)
  {
    console.log('Declaring move for x = ', xCell, 'y = ', yCell);
    this.store.dispatch(
      new PlayNextMove({ xCell, yCell })
    );
  }

  // cellIcon(cellX: number, cellY: number)
  // {
  //   const cellIndex = this.cellIdx(cellX, cellY);
  //   const cellValue = this.latestOutcome.boardState[cellIndex];
  //   console.log('Revealing icon for: cellX -> ', cellX, 'cellY -> ', cellY, ' = ', cellIndex, ' -> ', cellValue);
  cellIcon(gameBoardCell: GameBoardCell) {
    console.log(`Revealing ${JSON.stringify(gameBoardCell)}`);
    const cellValue = gameBoardCell.content;

    if (cellValue === -1) {
      return '/assets/tiles/unk.png';
    } else if (cellValue === 0) {
      return '/assets/tiles/blank.png';
    } else if (cellValue === 9) {
      return '/assets/tiles/boom.png';
    } else {
      return `/assets/tiles/0${cellValue}.png`;
    }
  }
}
