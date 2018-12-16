import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as ndarray from 'ndarray';
import {MinesweeperActions, MinesweeperActionTypes} from '../actions/minesweeper.actions';
import {InvalidStateChangeError} from '../dto/exception/InvalidStateChangeError';
import * as util from 'util';
import {
  GameBoardCell, GameBoardState, GameBoardStateType, GameOutcome, InactiveGameBoardState, PlayerState, PlayerStateType, SetupOptions, State
} from '../models/minesweeper.models';

const BLANK_INVALID_BOARD: InactiveGameBoardState = {
  boardContent: [],
  safeCellsLeft: 0,
  type: GameBoardStateType.INACTIVE
};

export const initialState: State = {
  setupOptions: {
    xSize: 3,
    ySize: 3,
    mineCount: 3,
  },
  playerState: {
    type: PlayerStateType.INACTIVE,
  },
  gameBoardState: BLANK_INVALID_BOARD,
  previousResult: GameOutcome.UNRESOLVED
};

export const featureKey = 'minesweeper';

function areBoardOptionsValid(state: SetupOptions)
{
  const {xSize, ySize, mineCount} = state;

  return (
    (xSize >= 3) && (ySize >= 3)) && (mineCount > 0) && (mineCount < (xSize * ySize)
  );
}

function areBoardOptionsMutable(state: State) {
  return state.playerState.type === PlayerStateType.INACTIVE;
}

function reduceCellRevelations(
  gameBoardContent: ReadonlyArray<GameBoardCell>,
  setupOptions: SetupOptions,
  cellsRevealed: ReadonlyArray<GameBoardCell>)
{
  const boardContent = [...gameBoardContent];
  const ndBoardState: ndarray<GameBoardCell> =
    ndarray<GameBoardCell>(boardContent, [setupOptions.xSize, setupOptions.ySize]);
  let revealedCell: GameBoardCell;
  for (revealedCell of cellsRevealed) {
    // Bypass ndarray.set() since it's type signature incorrectly
    // tolerates only numbers.  ndarray.index() incorrectly types its
    // return as <T>, but it is truly always an integer.
    const stateIndex: number =
      ndBoardState.index(
        revealedCell.xCell, revealedCell.yCell
      ) as unknown as number;

    boardContent[stateIndex] = {
      ...ndBoardState.get(revealedCell.xCell, revealedCell.yCell),
      content: revealedCell.content
    };

    console.log(
      `Revealed ${util.inspect(revealedCell, true, 10, true)} at ${stateIndex}`);
  }

  return boardContent;
}

function reallocateBoardContent(gameBoardState: GameBoardState, setupOptions: SetupOptions): InactiveGameBoardState
{
  const boardSize = setupOptions.xSize * setupOptions.ySize;
  const safeCellsLeft = boardSize - setupOptions.mineCount;
  const oldBoardContent = gameBoardState.boardContent;

  const boardContent = new Array(boardSize);
  for (let ii = 0, xx = 0; ii < boardSize; xx++)
  {
    for (let yy = 0; yy < setupOptions.ySize; yy++, ii++) {
      const { xCell, yCell, content } = oldBoardContent[ii];

      boardContent[ii] = ((xCell === xx) && (yCell === yy) && (content === -1))
        ? oldBoardContent[ii]
        : {
          id: ii,
          xCell: xx,
          yCell: yy,
          content: -1
        };
    }
  }

  return {
    type: GameBoardStateType.INACTIVE,
    boardContent,
    safeCellsLeft
  };
}

function applyGameBoardOptions(
  gameBoardState: GameBoardState, setupOptions: SetupOptions): InactiveGameBoardState
{
  if (areBoardOptionsValid(setupOptions)) {
    return reallocateBoardContent(gameBoardState, setupOptions);
  } else {
    return BLANK_INVALID_BOARD;
  }
}

export function reducer(state = initialState, action: MinesweeperActions): State
{
  let {setupOptions, playerState, gameBoardState} = state;

  switch (action.type) {
    case MinesweeperActionTypes.SetXSize:
    {
      if (! areBoardOptionsMutable(state)) {
        throw new InvalidStateChangeError('Can only change board options when a game is not in progress!');
      }

      if (setupOptions.xSize === action.payload) {
        return state;
      }

      setupOptions = { ...setupOptions, xSize: action.payload };
      gameBoardState = applyGameBoardOptions(gameBoardState, setupOptions);

      return { ...state, setupOptions, gameBoardState };
    }

    case MinesweeperActionTypes.SetYSize:
    {
      if (! areBoardOptionsMutable(state)) {
        throw new InvalidStateChangeError('Can only change board options when a game is not in progress!');
      }

      if (setupOptions.ySize === action.payload) {
        return state;
      }

      setupOptions = { ...setupOptions, ySize: action.payload };
      gameBoardState = applyGameBoardOptions(gameBoardState, setupOptions);

      return { ...state, setupOptions, gameBoardState };
    }

    case MinesweeperActionTypes.SetMineCount:
    {
      if (! areBoardOptionsMutable(state)) {
        throw new InvalidStateChangeError('Can only change board options when a game is not in progress!');
      }

      if (setupOptions.ySize === action.payload) {
        return state;
      }

      setupOptions = { ...setupOptions, mineCount: action.payload };

      return { ...state, setupOptions };
    }

    case MinesweeperActionTypes.SendBeginGame:
    {
      if (gameBoardState !== BLANK_INVALID_BOARD) {
        throw new InvalidStateChangeError('Cannot begin a game unless board options are valid');
      } else if (gameBoardState.type !== GameBoardStateType.INACTIVE ) {
        throw new InvalidStateChangeError('Cannot begin a game unless no game is in progress');
      }

      gameBoardState = {
        ...gameBoardState,
        type: GameBoardStateType.ACTIVE,
      };

      return {
        ...state,
        gameBoardState,
      };
    }

    case MinesweeperActionTypes.SendNextMove:
    {
      if (playerState.type !== PlayerStateType.THINKING) {
        throw new InvalidStateChangeError('Cannot make a move outside of player\'s turn.');
      }

      playerState = {
        ...playerState,
        type: PlayerStateType.OUTCOME_PENDING,
        latestMove: action.payload,
      };

      return {
        ...state,
        playerState
      };
    }

    case MinesweeperActionTypes.ReceiveGameContinues:
    {
      // TODO: When supporting canceling a game, tolerate receiving a belated result from cancelled game.
      if ((playerState.type !== PlayerStateType.OUTCOME_PENDING) &&
        (playerState.type !== PlayerStateType.SETUP_PENDING)) {
        throw new InvalidStateChangeError('Unexpected continue game outcome received');
      } else if (gameBoardState.type !== GameBoardStateType.ACTIVE) {
        throw new InvalidStateChangeError('Game board state is inactive');
      } else if (playerState.nextTurnId !== action.payload.afterTurnId) {
        throw new InvalidStateChangeError(
          `Outcome for turn id ${action.payload.afterTurnId} does not match expected turn id, ${playerState.nextTurnId}`);
      }

      const safeCellsLeft = action.payload.safeCellsLeft;
      const boardContent =
        (playerState.type === PlayerStateType.OUTCOME_PENDING)
          ? reduceCellRevelations(gameBoardState.boardContent, setupOptions, action.payload.cellsRevealed)
          : gameBoardState.boardContent;

      gameBoardState = {
        ...gameBoardState,
        safeCellsLeft,
        boardContent
      };
      playerState = {
        ...playerState,
        type: PlayerStateType.THINKING,
        nextTurnId: action.payload.nextTurnId
      };

      return {
        ...state,
        gameBoardState,
        playerState
      };
    }

    case MinesweeperActionTypes.ReceiveGameConcluded:
    {
      if ((playerState.type !== PlayerStateType.OUTCOME_PENDING) &&
        (playerState.type !== PlayerStateType.ABORT_PENDING)) {
        throw new InvalidStateChangeError('Unexpected continue game outcome received');
      } else if (gameBoardState.type !== GameBoardStateType.ACTIVE) {
        throw new InvalidStateChangeError('Game board is already inactive');
      } else if (playerState.nextTurnId !== action.payload.afterTurnId) {
        throw new InvalidStateChangeError(
          `Outcome for turn id ${action.payload.afterTurnId} does not match expected turn id, ${playerState.nextTurnId}`);
      }

      gameBoardState = {
        ...gameBoardState,
        safeCellsLeft: action.payload.safeCellsLeft,
        boardContent: reduceCellRevelations(gameBoardState.boardContent, setupOptions, action.payload.cellsRevealed)
      };
      playerState = {
        latestMove: playerState.latestMove,
        type: PlayerStateType.INACTIVE
      };

      return { ...state, gameBoardState, playerState };
    }

    case MinesweeperActionTypes.SendAbortGame:
    {
      if (gameBoardState.type !== GameBoardStateType.ACTIVE) {
        throw new InvalidStateChangeError('Can only end a game when there is a game to end.');
      } else if (playerState.type !== PlayerStateType.THINKING) {
        throw new InvalidStateChangeError('Please wait for pending network activity to abate.');
      }

      playerState = {
        ...playerState,
        type: PlayerStateType.ABORT_PENDING
      };

      return {
        ...state,
        playerState
      };
    }

    default:
      return state;
  }
}

export const selectMinesweeperState = createFeatureSelector<State>(featureKey);

export const selectNewGameProps = createSelector(
  selectMinesweeperState, (state: State) => state.setupOptions
);

// export const selectCreateBoardRequest = createSelector(
//   selectXSize, selectYSize, selectMineCount,
//   (xSize: number, ySize: number, mineCount: number): ICreateGameRequestDto => {
//     return { xSize, ySize, mineCount };
//   }
// );

export const selectPlayerState = createSelector(
  selectMinesweeperState, (state: State) => state.playerState
);
export const selectNextTurnId = createSelector(
  selectPlayerState, (playerState: PlayerState) => {
    if (playerState.type === PlayerStateType.THINKING) {
      return playerState.nextTurnId;
    }
  });
export const selectExpectedTurnId = createSelector(
  selectPlayerState, (playerState: PlayerState) => {
    if ( (playerState.type !== PlayerStateType.THINKING) && (playerState.type !== PlayerStateType.INACTIVE)) {
      return playerState.nextTurnId;
    }
  });

export const selectGameProgress = createSelector(
  [
    selectBoardState, selectSafeCellsLeft, selectNextTurnId,
    selectPlayerStateType, selectXSize, selectYSize
  ],
  (boardState: GameBoardCell[], safeCellsLeft: number, nextTurnId: number,
    playerStatus: PlayerStateType, xSize: number, ySize: number) =>
    (
      {
        boardState,
        safeCellsLeft,
        nextTurnId,
        playerStatus,
        xSize,
        ySize
      }
    ));

export const selectGameState = createSelector(
  selectMinesweeperState, (state: State) => state.gameBoardState);

export const selectPlayerHasTurn = createSelector(
  selectPlayerState, (state: PlayerState) => state.type === PlayerStateType.THINKING
);

export const selectPlayerMayStartGame = createSelector(
  [selectPlayerState, selectNewGameProps],
  (playerState: PlayerState, setupOptions: SetupOptions) =>
    (playerState.type === PlayerStateType.INACTIVE) && areBoardOptionsValid(setupOptions)
)

export const selectWaitingOnServer = createSelector(
  selectPlayerState, (state: PlayerState) => (
    (state.type === PlayerStateType.OUTCOME_PENDING) ||
    (state.type === PlayerStateType.SETUP_PENDING) ||
    (state.type === PlayerStateType.ABORT_PENDING)
  )
);




export const allSelectors = {
  selectNewGameProps: selectNewGameProps,
  selectNextTurnId: selectNextTurnId,
  selectSafeCellsLeft: selectSafeCellsLeft,
  selectBoardState: selectBoardState,
  selectGameProgress: selectGameProgress,
  selectGameState: selectGameState,

  // selectWaitingForServer: selectWaitingForServer,
  // selectWaitingForPlayerMove: selectWaitingForPlayerMove,
  // selectPlayerMaySetOptions: selectPlayerMaySetOptions,
  // selectPlayerMayBeginGame: selectPlayerMayBeginGame,
  // selectPlayerMustResetGame: selectPlayerMustResetGame
};
