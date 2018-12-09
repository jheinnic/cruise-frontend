import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as ndarray from 'ndarray';

import {RevealedCellContent} from '../dto/replies/revealed-cell-content.class';
import {PlayerStatus} from '../dto/replies/player-status.enum';
import {MinesweeperActions, MinesweeperActionTypes} from './minesweeper.actions';
import {InvalidStateChangeError} from '../dto/exception/InvalidStateChangeError';
import * as util from 'util';
import {GameBoardCell} from './minesweeper.models';

export enum GameState {
  INVALID_GAME_PARAMETERS = 'InvalidGameParameters',
  READY_TO_BEGIN_GAME = 'ReadyToBeginGame',
  WAITING_FOR_GAME_SETUP = 'WaitingForGameSetup',
  WAITING_FOR_PLAYER_MOVE = 'WaitingForPlayerMove',
  WAITING_FOR_MOVE_OUTCOME = 'WaitingForMoveOutcome',
  PLAYER_HAS_WON = 'PlayerHasWon',
  PLAYER_HAS_LOST = 'PlayerHasLost'
}
export interface State {
  gameState: GameState;
  playerStatus: PlayerStatus;
  xSize: number;
  ySize: number;
  mineCount: number;
  boardState: GameBoardCell[];
  nextTurnId: number;
  safeCellsLeft: number;
}

export const initialState: State = {
  gameState: GameState.READY_TO_BEGIN_GAME,
  playerStatus: PlayerStatus.INACTIVE,
  xSize: 3,
  ySize: 3,
  mineCount: 3,
  boardState: [],
  nextTurnId: -1,
  safeCellsLeft: -1,
};

export const featureKey = 'minesweeper';

function areBoardOptionsValid(xSize: number, ySize: number, mineCount: number) {
  return ((xSize >= 3) && (ySize >= 3)) && (mineCount > 0) && (mineCount < (xSize * ySize));
}

export function reducer(state = initialState, action: MinesweeperActions): State {
  let gameState: GameState = state.gameState;
  let boardState: GameBoardCell[] = [];

  switch (action.type) {
    case MinesweeperActionTypes.SetXSize:
    {
      gameState = state.gameState;
      if ((gameState !== GameState.INVALID_GAME_PARAMETERS)
        && (gameState !== GameState.READY_TO_BEGIN_GAME)) {
        throw new InvalidStateChangeError('Can only change board options when a game is not in progress!');
      }

      const xSize = action.payload;
      if (areBoardOptionsValid(xSize, state.ySize, state.mineCount)) {
        gameState = GameState.READY_TO_BEGIN_GAME;
      } else {
        gameState = GameState.INVALID_GAME_PARAMETERS;
      }

      return { ...state, xSize, gameState };
    }

    case MinesweeperActionTypes.SetYSize:
    {
      gameState = state.gameState;
      if ((gameState !== GameState.INVALID_GAME_PARAMETERS)
        && (gameState !== GameState.READY_TO_BEGIN_GAME)) {
        throw new InvalidStateChangeError('Can only change board options when a game is not in progress!');
      }

      const ySize = action.payload;
      if (areBoardOptionsValid(state.xSize, ySize, state.mineCount)) {
        gameState = GameState.READY_TO_BEGIN_GAME;
      } else {
        gameState = GameState.INVALID_GAME_PARAMETERS;
      }

      return { ...state, ySize, gameState };
    }

    case MinesweeperActionTypes.SetMineCount:
    {
      gameState = state.gameState;
      if ((gameState !== GameState.INVALID_GAME_PARAMETERS)
        && (gameState !== GameState.READY_TO_BEGIN_GAME)) {
        throw new InvalidStateChangeError('Can only change board options when a game is not in progress!');
      }

      const mineCount = action.payload;
      if (areBoardOptionsValid(state.xSize, state.ySize, mineCount)) {
        gameState = GameState.READY_TO_BEGIN_GAME;
      } else {
        gameState = GameState.INVALID_GAME_PARAMETERS;
      }

      return { ...state, mineCount, gameState };
    }

    case MinesweeperActionTypes.BeginNewGame:
    {
      if (state.gameState !== GameState.READY_TO_BEGIN_GAME) {
        throw new InvalidStateChangeError('Cannot begin a game unless board options are valid and no game is in progress');
      }
      gameState = GameState.WAITING_FOR_GAME_SETUP;
      const boardSize = state.xSize * state.ySize;
      boardState = new Array(boardSize);
      for (let ii = 0, xx = 0; ii < boardSize; xx++ ) {
        for (let yy = 0; yy < state.ySize; yy++, ii++ ) {
          boardState[ii] = {
            id: ii,
            xCell: xx,
            yCell: yy,
            content: -1
          };
        }
      }

      return {
        ...state, boardState, gameState, safeCellsLeft: (boardSize - state.mineCount),
      };
    }

    case MinesweeperActionTypes.PlayNextMove:
    {
      if (state.gameState !== GameState.WAITING_FOR_PLAYER_MOVE) {
        throw new InvalidStateChangeError('Cannot make a move when the game is not yet player\'s turn.');
      }

      gameState = GameState.WAITING_FOR_MOVE_OUTCOME;
      /*
      boardState = [...state.boardState];
      const ndBoardState: ndarray<GameBoardCell> =
        ndarray<GameBoardCell>(boardState, [state.xSize, state.ySize]);

      // Replace selected cell with one using "-2" marker content until its content
      // has been revealed by server return.  Bypass ndarray.set() since it's type
      // signature incorrectly tolerates only numbers.  ndarray.index() is incorrectly
      // typed as <T> rather than number, but this is easier to work around than the
      // mistaken last entry of the ... rest type in set().
      const index: number =
        ndBoardState.index(
          action.payload.xCell, action.payload.yCell
        ) as unknown as number;

      boardState[index] = {
        ...ndBoardState.get(action.payload.xCell, action.payload.yCell),
        content: -2
      };
      */

      return { ...state, /*boardState,*/ gameState };
    }

    case MinesweeperActionTypes.ShowRevealedCells:
    {
      // TODO: When supporting canceling a game, tolerate receiving a belated result from cancelled game.

      if (state.gameState !== GameState.WAITING_FOR_MOVE_OUTCOME) {
        throw new InvalidStateChangeError('Cannot reveal cells when no player move is pending a response');
      }

      let safeCellsLeft = state.safeCellsLeft;
      if (action.payload.playerStatus !== PlayerStatus.DEFEATED) {
        safeCellsLeft -= action.payload.cellsRevealed.length;
      }

      boardState = [...state.boardState];
      const ndBoardState: ndarray<GameBoardCell> =
        ndarray<GameBoardCell>(boardState, [state.xSize, state.ySize]);
      let revealedCell: RevealedCellContent;
      for (revealedCell of action.payload.cellsRevealed) {
        // Bypass ndarray.set() since it's type signature incorrectly
        // tolerates only numbers.  ndarray.index() incorrectly types its
        // return as <T>, but it is truly always an integer.
        const stateIndex: number =
          ndBoardState.index(
            revealedCell.xCell, revealedCell.yCell
          ) as unknown as number;

        boardState[stateIndex] = {
          ...ndBoardState.get(revealedCell.xCell, revealedCell.yCell),
          content: revealedCell.content
        };

        console.log(
          `Revealed ${util.inspect(revealedCell, true, 10, true)} at ${stateIndex}`);
      }

      return {
        ...state,
        boardState,
        safeCellsLeft,
        playerStatus: action.payload.playerStatus,
        nextTurnId: action.payload.nextTurnId,
      };
    }

    case MinesweeperActionTypes.RequestNextMove:
    {
      gameState = state.gameState;
      if ((gameState !== GameState.WAITING_FOR_GAME_SETUP) &&
        (gameState !== GameState.WAITING_FOR_MOVE_OUTCOME))
      {
        throw new InvalidStateChangeError(
          'May only request player\'s next move after starting a game or resolving previous outcome.');
      }

      return {
        ...state,
        gameState: GameState.WAITING_FOR_PLAYER_MOVE,
        boardState: [...state.boardState],
        nextTurnId: action.payload
      };
    }

    case MinesweeperActionTypes.ReportPlayerLoses:
    {
      gameState = state.gameState;
      if (gameState !== GameState.WAITING_FOR_MOVE_OUTCOME)
      {
        throw new InvalidStateChangeError(
          'May only find player wins or loses from results of previous move.');
      }

      gameState = GameState.PLAYER_HAS_LOST;

      return { ...state, gameState };
    }

    case MinesweeperActionTypes.ReportPlayerWins:
    {
      gameState = state.gameState;
      if (gameState !== GameState.WAITING_FOR_MOVE_OUTCOME)
      {
        throw new InvalidStateChangeError(
          'May only find player wins or loses from results of previous move.');
      }

      gameState = GameState.PLAYER_HAS_WON;

      return { ...state, gameState };
    }

    case MinesweeperActionTypes.EndCurrentGame:
    {
      gameState = state.gameState;
      if ((gameState === GameState.INVALID_GAME_PARAMETERS)
        || (gameState === GameState.READY_TO_BEGIN_GAME)) {
        throw new InvalidStateChangeError('Can only end a game when there is a game to end.');
      }

      if ((gameState === GameState.WAITING_FOR_GAME_SETUP)
        || (gameState === GameState.WAITING_FOR_MOVE_OUTCOME)) {
        throw new InvalidStateChangeError('Please wait for pending network activity to abate.');
      }

      // TODO: Allow for a cleanup API call before returning to READY.

      gameState = GameState.READY_TO_BEGIN_GAME;

      return { ...state, gameState };
    }


    default:
      return state;
  }
}

export const selectMinesweeperState = createFeatureSelector<State>(featureKey);

const getXSize = (state: State) => state.xSize;
export const selectXSize = createSelector(selectMinesweeperState, getXSize);

const getYSize = (state: State) => state.ySize;
export const selectYSize = createSelector(selectMinesweeperState, getYSize);

const getMineCount = (state: State) => state.mineCount;
export const selectMineCount = createSelector(selectMinesweeperState, getMineCount);

export const selectNewGameProps = createSelector(
  [selectXSize, selectYSize, selectMineCount],
  (xSize: number, ySize: number, mineCount: number) => ({ xSize, ySize, mineCount })
);

// export const selectCreateBoardRequest = createSelector(
//   selectXSize, selectYSize, selectMineCount,
//   (xSize: number, ySize: number, mineCount: number): ICreateGameRequestDto => {
//     return { xSize, ySize, mineCount };
//   }
// );

const getNextTurnId = (state: State) => state.nextTurnId;
export const selectNextTurnId = createSelector(
  selectMinesweeperState, getNextTurnId);

// export const selectMakeNextMoveRequest = createSelector(
//   (rootStore: any, cellIndex: number): [State, number] => {
//     return [rootStore.minesweeper, cellIndex];
//   },
//   (pair: [State, number]): IMakeMoveRequestDto => {
//     const turnId = pair[0].nextTurnId;
//     const yCell = pair[1] % pair[0].xSize;
//     const xCell = (pair[1] - yCell) / pair[0].xSize;
//
//     return {turnId, xCell, yCell};
//   }
// );

// const getBoardState = (state: State) => {
//   if (!! state.boardState && (state.boardState.length > 0)) {
//     const ndBoardState = ndarray(state.boardState, [state.xSize, state.ySize]);
//     const rows = new Array(state.ySize);
//     for (let ii = 0; ii < state.ySize; ii++) {
//       rows[ii] = ndBoardState.pick(null, ii);
//     }
//     return rows;
//   }
//
//   return state.boardState;
// };
const getBoardState = (state: State) => state.boardState;
export const selectBoardState = createSelector(selectMinesweeperState, getBoardState);

const getSafeCellsLeft = (state: State) => state.safeCellsLeft;
export const selectSafeCellsLeft = createSelector(selectMinesweeperState, getSafeCellsLeft);

const getPlayerStatus = (state: State) => state.playerStatus;
export const selectPlayerStatus = createSelector(selectMinesweeperState, getPlayerStatus);

export const selectGameProgress = createSelector(
  [selectBoardState, selectSafeCellsLeft, selectNextTurnId,
    selectPlayerStatus, selectXSize, selectYSize],
  (boardState: GameBoardCell[], safeCellsLeft: number, nextTurnId: number,
    playerStatus: PlayerStatus, xSize: number, ySize: number) =>
      ({boardState, safeCellsLeft, nextTurnId, playerStatus, xSize, ySize}));

export const selectGameState = createSelector(
  selectMinesweeperState, (state: State) => state.gameState);

export const selectWaitingForPlayerMove = createSelector(
  selectMinesweeperState, (state: State) =>
    (state.gameState === GameState.WAITING_FOR_PLAYER_MOVE)
);


// export const selectWaitingForServer = createSelector(
//   selectMinesweeperState, (state: State) => (
//     (state.gameState === GameState.WAITING_FOR_MOVE_OUTCOME) ||
//     (state.gameState === GameState.WAITING_FOR_GAME_SETUP)
//   )
// );

// export const selectPlayerMaySetOptions = createSelector(
//   selectMinesweeperState, (state: State) => (
//     (state.gameState === GameState.INVALID_GAME_PARAMETERS) ||
//     (state.gameState === GameState.READY_TO_BEGIN_GAME)
//   )
// );

// export const selectPlayerMayBeginGame = createSelector(
//   selectMinesweeperState, (state: State) =>
//     (state.gameState === GameState.READY_TO_BEGIN_GAME)
// );

// export const selectPlayerMustResetGame = createSelector(
//   selectMinesweeperState, (state: State) => (
//     (state.gameState === GameState.PLAYER_HAS_LOST) ||
//     (state.gameState === GameState.PLAYER_HAS_WON)
//   )
// );

export const allSelectors = {
  selectXSize: selectXSize,
  selectYSize: selectYSize,
  selectMineCount: selectMineCount,
  selectNextTurnId: selectNextTurnId,
  selectSafeCellsLeft: selectSafeCellsLeft,

  selectBoardState: selectBoardState,
  selectNewGameProps: selectNewGameProps,
  selectGameProgress: selectGameProgress,
  selectGameState: selectGameState,

  // selectWaitingForServer: selectWaitingForServer,
  // selectWaitingForPlayerMove: selectWaitingForPlayerMove,
  // selectPlayerMaySetOptions: selectPlayerMaySetOptions,
  // selectPlayerMayBeginGame: selectPlayerMayBeginGame,
  // selectPlayerMustResetGame: selectPlayerMustResetGame
};
