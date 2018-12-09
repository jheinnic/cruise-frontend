import {RevealedCellContent} from './revealed-cell-content.class';
import {IsDefined, IsPositive, IsUUID} from 'class-validator';

export class GameResumedDto
{
  @IsUUID()
  public readonly gameBoardId: string;

  @IsPositive()
  public readonly latestTurnId: number;

  @IsDefined()
  public readonly cellsRevealed: ReadonlyArray<RevealedCellContent>;

  @IsPositive()
  public readonly safeCellsLeft: number;

  constructor(
    gameBoardId: string,
    latestTurnId: number,
    cellsRevealed: ReadonlyArray<RevealedCellContent>,
    safeCellsLeft: number
  )
  {
    this.gameBoardId = gameBoardId;
    this.latestTurnId = latestTurnId;
    this.cellsRevealed = cellsRevealed;
    this.safeCellsLeft = safeCellsLeft;
  }
}

export interface IGameResumedDto extends GameResumedDto { }
