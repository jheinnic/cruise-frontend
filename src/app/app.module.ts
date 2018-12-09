import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {StoreRouterConnectingModule} from '@ngrx/router-store';

import {AppEffects, reducerOptions, reducers} from './store';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SharedModule} from './shared/shared.module';
import {ToymodModule} from './features/toymod/toymod.module';
import {CoreModule} from './core/core.module';
import {ContactsModule} from './features/contacts/contacts.module';
import {MinesweeperModule} from './features/minesweeper/minesweeper.module';
import {environment} from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    StoreModule.forRoot(reducers, reducerOptions),
    StoreRouterConnectingModule.forRoot({stateKey: 'routerReducer'}),
    EffectsModule.forRoot([AppEffects]),
    CoreModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    SharedModule,
    ToymodModule,
    ContactsModule,
    MinesweeperModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
