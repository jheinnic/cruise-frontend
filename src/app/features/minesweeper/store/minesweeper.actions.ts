import {Action} from '@ngrx/store';
import {ICreateGameRequestDto} from '../dto/requests/create-game-request.dto';
import {IMakeMoveRequestDto} from '../dto/requests/make-move-request.dto';
import {IPlayerTurnOutcomeDto} from '../dto/replies/player-turn-outcome.dto';

export enum MinesweeperActionTypes
{
  SetXSize = '[Minesweeper] Set X Size',
  SetYSize = '[Minesweeper] Set Y Size',
  SetMineCount = '[Minesweeper] Set Mine Count',
  BeginNewGame = '[Minesweeper] Begin Minesweeper game',
  PlayNextMove = '[Minesweeper] Make next minesweeper move',
  RequestNextMove = '[Minesweeper] Request player\'s next move',
  ShowRevealedCells = '[Minesweeper] Process newly revealed cells',
  ReportPlayerLoses = '[Minesweeper] Process game loss result',
  ReportPlayerWins = '[Minesweeper] Process game win result',
  EndCurrentGame = '[Minesweeper] End current game',
}

export class SetXSize implements Action
{
  readonly type = MinesweeperActionTypes.SetXSize;

  constructor(public readonly payload: number) { }
}

export class SetYSize implements Action
{
  readonly type = MinesweeperActionTypes.SetYSize;

  constructor(public readonly payload: number) { }
}

export class SetMineCount implements Action
{
  readonly type = MinesweeperActionTypes.SetMineCount;

  constructor(public readonly payload: number) { }
}

export class BeginNewGame implements Action
{
  readonly type = MinesweeperActionTypes.BeginNewGame;

  constructor() { }
}

export class PlayNextMove implements Action
{
  readonly type = MinesweeperActionTypes.PlayNextMove;

  constructor(public readonly payload: {xCell: number, yCell: number}) { }
}

export class RequestNextMove implements Action
{
  readonly type = MinesweeperActionTypes.RequestNextMove;

  constructor(public readonly payload: number) { }
}

export class ShowRevealedCells implements Action
{
  readonly type = MinesweeperActionTypes.ShowRevealedCells;

  constructor(public readonly payload: IPlayerTurnOutcomeDto) { }
}

export class ReportPlayerLoses implements Action
{
  readonly type = MinesweeperActionTypes.ReportPlayerLoses;

  constructor() { }
}

export class ReportPlayerWins implements Action
{
  readonly type = MinesweeperActionTypes.ReportPlayerWins;

  constructor() { }
}

export class EndCurrentGame implements Action
{
  readonly type = MinesweeperActionTypes.EndCurrentGame;

  constructor() { }
}

export type MinesweeperActions =
  SetXSize
  | SetYSize
  | SetMineCount
  | BeginNewGame
  | PlayNextMove
  | RequestNextMove
  | ShowRevealedCells
  | ReportPlayerLoses
  | ReportPlayerWins
  | EndCurrentGame;

