// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {Keys} from 'simplytyped';

export const environment = {
  production: false,
  baseAppUrl: 'http://portfolio.dev.jchein.name:4200',
  mineSweeperApiUrl: '/game',
  keycloakConfigPath: '/assets/keycloak.json',
  keycloakServerUrl: 'http://portfolio.dev.jchein.name:28080/auth',
  onLoginRedirectUrl: '/route-one',
  onRegisterRedirectUrl: '/route-one',
  onLogoutRedirectUrl: '/route-two',
  apolloGraphQueryUrl: 'http://www.cnn.com',
  neo4jGraphQueryUrl: 'http://www.cnn.com',
  randomArtBootstrapPath: '/'
};

function injectFromEnvironment(tokenName: Exclude<Keys<typeof environment>, 'production'>): InjectionToken<string> {
  return new InjectionToken<string>(tokenName, {
    providedIn: 'root',
    factory: () => environment[tokenName]
  });
}

export const baseAppUrl: InjectionToken<string> = injectFromEnvironment('baseAppUrl');
export const mineSweeperApiUrl: InjectionToken<string> = injectFromEnvironment('mineSweeperApiUrl');
export const keycloakConfigPath: InjectionToken<string> = injectFromEnvironment('keycloakConfigPath');
export const keycloakServerUrl: InjectionToken<string> = injectFromEnvironment('keycloakServerUrl');
export const onLoginRedirectUrl: InjectionToken<string> = injectFromEnvironment('onLoginRedirectUrl');
export const onRegisterRedirectUrl: InjectionToken<string> = injectFromEnvironment('onRegisterRedirectUrl');
export const onLogoutRedirectUrl: InjectionToken<string> = injectFromEnvironment('onLogoutRedirectUrl');
export const apolloGraphQueryUrl: InjectionToken<string> = injectFromEnvironment('apolloGraphQueryUrl');
export const neo4jGraphQueryUrl: InjectionToken<string> = injectFromEnvironment('neo4jGraphQueryUrl');
export const randomArtBootstrapPath: InjectionToken<string> = injectFromEnvironment('randomArtBootstrapPath');

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';
import {InjectionToken} from '@angular/core';  // Included with Angular CLI.
