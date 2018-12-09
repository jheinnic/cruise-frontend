import {Max, Min} from 'class-validator';

/**
 * Cartesian coordinates and an indicator as to cell content.
 *
 * Content is 0 through 8 if there are 0 through 8 adjacent cells with a mine present.
 *
 * Content is 9 if there is a mine in this cell itself.  No information is given about
 * neighboring cells in this case, but it also usually means the game is over anyhow,
 * and only appears when we reveal all board content at game over.
 */
export class RevealedCellContent
{
   @Min(0)
   readonly xCell: number;

   @Min(0)
   readonly yCell: number;

   @Min(0)
   @Max(9)
   readonly content: number;

   constructor(
      xCell: number,
      yCell: number,
      content: number
   ) {
      this.xCell = xCell;
      this.yCell = yCell;
      this.content = content;
   }
}
