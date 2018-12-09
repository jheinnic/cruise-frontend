import {APP_INITIALIZER, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {LayoutModule} from '@angular/cdk/layout';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {
  MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatListModule, MatMenuModule, MatSidenavModule, MatTabsModule,
  MatToolbarModule
} from '@angular/material';

import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {ApolloModule} from 'apollo-angular';
import {HttpLinkModule} from 'apollo-angular-link-http';
import {NgrxCache, NgrxCacheModule} from 'apollo-angular-cache-ngrx';
import {LoggerModule, NGXLogger, NgxLoggerLevel} from 'ngx-logger';
// import {KeycloakAngularModule, KeycloakOptions, KeycloakService} from 'keycloak-angular';
import {moduleImportGuard} from '../utils/module-import-guard.helper';
// import {keycloakOptions} from '../shared/di/keycloak-di.tokens';
import {LayoutComponent} from './layout/layout.component';
import {SharedModule} from '../shared/shared.module';
import {CoreFeature, LayoutEffects, ToymodEffects} from './store';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LayoutModule,
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    BrowserAnimationsModule,
    HttpClientModule,
    LoggerModule.forRoot({
      serverLoggingUrl: '/api/logs',
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.OFF
    }),
    FlexLayoutModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTabsModule,
    SharedModule,
    ApolloModule,
    NgrxCacheModule,
    HttpLinkModule,
    // KeycloakAngularModule,
    StoreModule.forFeature(CoreFeature.featureKey, CoreFeature.reducerMap, {initialState: CoreFeature.initialState}),
    EffectsModule.forFeature([LayoutEffects, ToymodEffects])
  ],
  declarations: [LayoutComponent],
  providers: [
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: keycloakInitFactory,
    //   multi: true,
    //   deps: [keycloakOptions, KeycloakService, NGXLogger]
    // }
  ],
  exports: [
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ApolloModule,
    NgrxCacheModule,
    // HttpLinkModule,
    // KeycloakAngularModule,
    LayoutComponent
  ]
})
export class CoreModule
{
  constructor(@Optional() @SkipSelf() parentModule: CoreModule, ngrxCache: NgrxCache)
  {
    moduleImportGuard(parentModule, 'CoreModule');

    ngrxCache.create({});
  }
}

// function keycloakInitFactory(keycloakConfig: KeycloakOptions, keycloak: KeycloakService, logger: NGXLogger): () => Promise<any>
// {
  // keycloak.keycloakEvents$.subscribe((event) => {
  //   logger.info('Keycloak Event: ', JSON.stringify(event));
  // });
  // return (): Promise<boolean> => keycloak.init(keycloakConfig);
// }

// function gradientTokenInitFactory(gradientTokenService: GradientTokenService, http: HttpClient, logger: NGXLogger): () => Promise<any> {
//   return (): Promise<any> => {
//     return http.get('/assets/contracts/GradientToken.json')
//       .toPromise()
//       .then(
//         (resp: Response) => {
//           gradientTokenService.setupContract(resp);
//         },
//         (error: any): void => {
//           logger.error('Failed to load GradientToken contract: ', error);
//         }
//       );
//   }
// }
