import {PlayerStatus} from '../../dto/replies/player-status.enum';
import {Omit} from 'simplytyped';

export interface State
{
  readonly setupOptions: SetupOptions;
  readonly playerState: PlayerState;
  readonly gameBoardState: GameBoardState;
  readonly previousResult?: GameOutcome;
}

export interface SetupOptions
{
  readonly xSize: number;
  readonly ySize: number;
  readonly mineCount: number;
  readonly initialBoard: GameBoardCell[];
}

export interface CellCoordinates {
  readonly xCell: number;
  readonly yCell: number;
}

export interface CellIndex {
  readonly id: number;
}

export type CellLocation = CellCoordinates | CellIndex;

export interface GameBoardCell extends CellCoordinates, Partial<CellIndex>
{
  readonly content: number;
}

// export enum GameBoardStateType {
//   INACTIVE = 'inactive',
//   ACTIVE = 'active',
//   ABORTING = 'aborting'
// }

export interface GameBoardState
{
  // readonly type: GameBoardStateType.ACTIVE;
  readonly boardContent: ReadonlyArray<GameBoardCell>;
  readonly safeCellsLeft: number;
}

// export interface InactiveGameBoardState
// {
//   readonly type: GameBoardStateType.INACTIVE;
//   readonly boardContent?: ReadonlyArray<GameBoardCell>;
//   readonly safeCellsLeft?: number;
// }

// export interface AbortingGameBoardState
// {
//   readonly type: GameBoardStateType.ABORTING;
//   readonly boardContent: ReadonlyArray<GameBoardCell>;
//   readonly safeCellsLeft: number;
// }

// export type GameBoardState = InactiveGameBoardState | ActiveGameBoardState;

export enum GameOutcome {
  UNRESOLVED,
  VICTORY,
  DEFEAT
}

export enum PlayerStateType
{
  INACTIVE,
  THINKING,
  SETUP_PENDING,
  OUTCOME_PENDING,
  ABORT_PENDING
}

export interface InactivePlayerState
{
  readonly type: PlayerStateType.INACTIVE;
  readonly latestMove?: CellCoordinates;
}

export interface ThinkingPlayerState
{
  readonly type: PlayerStateType.THINKING;
  readonly latestMove?: CellCoordinates;
  readonly nextTurnId: number;
}

export interface SetupPendingPlayerState
{
  readonly type: PlayerStateType.SETUP_PENDING;
  readonly nextTurnId: 0;
}

export interface OutcomePendingPlayerState
{
  readonly type: PlayerStateType.OUTCOME_PENDING;
  readonly latestMove: CellCoordinates;
  readonly nextTurnId: number;
}

export interface AbortPendingPlayerState
{
  readonly type: PlayerStateType.ABORT_PENDING;
  readonly latestMove?: CellCoordinates;
  readonly nextTurnId: number;
}

export type PlayerState =
  InactivePlayerState
  | ThinkingPlayerState
  | SetupPendingPlayerState
  | OutcomePendingPlayerState
  | AbortPendingPlayerState
  ;

export interface LatestOutcome {
  readonly afterTurnId: number;
  readonly nextTurnId: number;
  readonly safeCellsLeft: number;
  readonly cellsRevealed: ReadonlyArray<GameBoardCell>;
}
