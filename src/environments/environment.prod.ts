import {InjectionToken} from '@angular/core';
import {Keys} from 'simplytyped';

export const environment = {
  production: true,
  baseAppUrl: 'http://portfolio.jchein.name',
  keycloakConfigPath: '/assets/keycloak.json',
  keycloakServerUrl: 'http://portfolio.jchein.name/auth',
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
export const keycloakConfigPath: InjectionToken<string> = injectFromEnvironment('keycloakConfigPath');
export const keycloakServerUrl: InjectionToken<string> = injectFromEnvironment('keycloakServerUrl');
export const onLoginRedirectUrl: InjectionToken<string> = injectFromEnvironment('onLoginRedirectUrl');
export const onRegisterRedirectUrl: InjectionToken<string> = injectFromEnvironment('onRegisterRedirectUrl');
export const onLogoutRedirectUrl: InjectionToken<string> = injectFromEnvironment('onLogoutRedirectUrl');
export const apolloGraphQueryUrl: InjectionToken<string> = injectFromEnvironment('apolloGraphQueryUrl');
export const neo4jGraphQueryUrl: InjectionToken<string> = injectFromEnvironment('neo4jGraphQueryUrl');
export const randomArtBootstrapPath: InjectionToken<string> = injectFromEnvironment('randomArtBootstrapPath');
