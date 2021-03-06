import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { ToymodActions } from '../actions';

@Injectable()
export class ToymodEffects {

  @Effect()
  effect$ = this.actions$.pipe(
    ofType(ToymodActions.ActionTypes.LoadToymods));

  constructor(private actions$: Actions<ToymodActions.Actions>) {}
}
