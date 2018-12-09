import {IsPositive, IsUUID, Max} from 'class-validator';

export class GameCreatedDto
{
  @IsUUID()
  public readonly gameBoardId: string;

  @IsPositive()
  @Max(2147483647)
  public readonly nextTurnId: number;

  constructor(gameBoardId: string, nextTurnId: number)
  {
    this.gameBoardId = gameBoardId;
    this.nextTurnId = nextTurnId;
  }
}

export interface IGameCreatedDto extends GameCreatedDto {}
