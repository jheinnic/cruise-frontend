import {Injectable} from '@angular/core';
import {Actions} from '@ngrx/effects';
import {LayoutActions} from '../actions';


@Injectable()
export class LayoutEffects
{
  constructor(_actions$: Actions<LayoutActions.Actions>) { }
}
