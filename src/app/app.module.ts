import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';

import {AppEffects, initialState, metaReducers, reducerOptions, reducers} from './store';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {environment} from '../environments/environment';
import {SharedModule} from './shared/shared.module';
import {ToymodModule} from './features/toymod/toymod.module';
import {CoreModule} from './core/core.module';


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
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
