import {InjectionToken} from '@angular/core';
import {environment} from '../../../environments/environment';

type EnvironmentTokenNames =
  'baseAppUrl'
  | 'keycloakConfigPath'
  | 'keycloakServerUrl'
  | 'onLoginRedirectUrl'
  | 'onRegisterRedirectUrl'
  | 'onLogoutRedirectUrl'
  | 'apolloGraphQueryUrl'
  | 'neo4jGraphQueryUrl'
  | 'randomArtBootstrapPath';

function injectFromEnvironment(tokenName: EnvironmentTokenNames): InjectionToken<string> {
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

