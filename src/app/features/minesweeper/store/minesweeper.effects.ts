import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {flatMap, map, take} from 'rxjs/operators';

import {
  MinesweeperActionTypes, PlayNextMove, ReportPlayerLoses, ReportPlayerWins, RequestNextMove, ShowRevealedCells
} from './minesweeper.actions';
import {mineSweeperApiUrl} from '../../../../environments/environment';
import {IGameCreatedDto} from '../dto/replies/game-created.dto';
import {IPlayerTurnOutcomeDto} from '../dto/replies/player-turn-outcome.dto';
import {PlayerStatus} from '../dto/replies/player-status.enum';
import * as fromStore from './minesweeper.reducer';
import {ICreateGameRequestDto} from '../dto/requests/create-game-request.dto';
import {IMakeMoveRequestDto} from '../dto/requests/make-move-request.dto';

@Injectable()
export class MinesweeperEffects {

  @Effect({dispatch: true})
  beginNewGame$ =
    this.actions$.pipe(
      ofType(MinesweeperActionTypes.BeginNewGame),
      flatMap(
        () => this.store$.select(
          fromStore.selectNewGameProps
        ).pipe(
          take(1),
          flatMap(
            (requestDto: ICreateGameRequestDto) => {
              console.log('Sending POST for ', this.apiUrl, requestDto);
              return this.httpClient.post<IGameCreatedDto>(
                this.apiUrl + '/', requestDto, {observe: 'response', responseType: 'json'}
              );
            }
          )
        )
      ),
      map(
        (response: HttpResponse<IGameCreatedDto>) => {
           console.log('Processing response: ', response);
           return new RequestNextMove(response.body.nextTurnId);
        }
      )
    );

  @Effect({dispatch: true})
  playNextMove$ =
    this.actions$.pipe(
      ofType(MinesweeperActionTypes.PlayNextMove),
      flatMap((action: PlayNextMove) => {
        return this.store$.select(fromStore.selectNextTurnId)
          .pipe(
            take(1),
            flatMap((nextTurnId: number) => {
              const request: IMakeMoveRequestDto = {
                turnId: nextTurnId,
                xCell: action.payload.xCell,
                yCell: action.payload.yCell
              };
              console.log('Sending PUT for', this.apiUrl, request);
              return this.httpClient.put<IPlayerTurnOutcomeDto>(
                this.apiUrl + '/', request, {observe: 'response', responseType: 'json'}
              );
            })
          );
      }),
      map((response: HttpResponse<IPlayerTurnOutcomeDto>) => {
        console.log('Received', response);
        return new ShowRevealedCells(response.body);
      })
  );

  @Effect({dispatch: true})
  showRevealedCells$ = this.actions$.pipe(
    ofType(MinesweeperActionTypes.ShowRevealedCells),
    map((response: ShowRevealedCells) => {
      console.log(response.payload);

      switch (response.payload.playerStatus) {
        case PlayerStatus.PLAYING: {
          return new RequestNextMove(response.payload.nextTurnId);
        }
        case PlayerStatus.DEFEATED: {
          return new ReportPlayerLoses();
        }
        case PlayerStatus.WINNER: {
          return new ReportPlayerWins();
        }
        default: {
          console.error('Unexpected status result: ' + response.payload.playerStatus);
        }
      }
    })
  );

  constructor(
    private actions$: Actions,
    private store$: Store<fromStore.State>,
    private httpClient: HttpClient,
    @Inject(mineSweeperApiUrl) private apiUrl: string
  ) { }
}
