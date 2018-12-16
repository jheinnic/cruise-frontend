import {IsDefined, IsPositive, Max, Min} from 'class-validator';
import {RevealedCellContent} from './revealed-cell-content.class';
import {PlayerStatus} from './player-status.enum';

export class PlayerTurnOutcomeDto
{
   @IsPositive()
   @Max(2147483647)
   public readonly afterTurnId: number;

   @IsPositive()
   @Max(2147483647)
   public readonly nextTurnId: number;

   @IsDefined()
   readonly playerStatus: PlayerStatus;

   @IsDefined()
   readonly cellsRevealed: ReadonlyArray<RevealedCellContent>;

   @Min(0)
   readonly safeCellsLeft: number;

   constructor(
      afterTurnId: number,
      nextTurnId: number,
      playerStatus: PlayerStatus,
      cellsRevealed: ReadonlyArray<RevealedCellContent>,
      safeCellsLeft: number
   )
   {
      this.currentTurnId = currentTurnId;
      this.nextTurnId = nextTurnId;
      this.playerStatus = playerStatus;
      this.cellsRevealed = cellsRevealed;
      this.safeCellsLeft = safeCellsLeft;
   }
}

export interface IPlayerTurnOutcomeDto extends PlayerTurnOutcomeDto { }
