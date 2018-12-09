import {PlayerStatus} from '../dto/replies/player-status.enum';

export interface BasicGameSetup {
  xSize: number;
  ySize: number;
  mineCount: number;
};

export interface LatestOutcome {
  boardState: GameBoardCell[];
  safeCellsLeft: number;
  nextTurnId: number;
  playerStatus: PlayerStatus;
};

export interface GameBoardCell {
  id: number;
  xCell: number;
  yCell: number;
  content: number;
}
