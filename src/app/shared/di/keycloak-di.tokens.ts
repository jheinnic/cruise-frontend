import {inject, InjectionToken} from '@angular/core';

import {KeycloakOptions} from 'keycloak-angular';
import {KeycloakLoginOptions} from 'keycloak-js';

import {baseAppUrl, onLoginRedirectUrl, onRegisterRedirectUrl, onLogoutRedirectUrl, keycloakServerUrl} from './config-di.tokens';


export const keycloakOptions: InjectionToken<KeycloakOptions> =
  new InjectionToken<KeycloakOptions>('keycloakOptions', {
    providedIn: 'root', // forwardRef(() => CoreModule),
    factory: (): KeycloakOptions => {
      return {
        config: {
          url: inject(keycloakServerUrl), // realms/Throwdown/protocol/openid-connect/auth?client_id=throwdown-webui',
          realm: 'Throwdown',
          clientId: 'throwdown-webui'
        },
        initOptions: {
          // adapter: 'default,'
          // onLoad: 'none',
          flow: 'standard',
          responseMode: 'fragment',
          checkLoginIframe: false
          // checkLoginIframeInterval: 21,
        }
      };
    }
  });

export const keycloakLoginOptions: InjectionToken<KeycloakLoginOptions> =
  new InjectionToken<KeycloakLoginOptions>('KeycloakLoginOptions', {
    providedIn: 'root',
    factory: (): KeycloakLoginOptions => {
      return {
        // locale: 'en_US',
        redirectUri: inject(baseAppUrl) + inject(onLoginRedirectUrl)
      };
    }
  });

export const keycloakRegisterOptions: InjectionToken<KeycloakLoginOptions> =
  new InjectionToken<KeycloakLoginOptions>('KeycloakRegisterOptions', {
    providedIn: 'root',
    factory: (): KeycloakLoginOptions => {
      return {
        action: 'register',
        // locale: 'en_US',
        redirectUri: inject(baseAppUrl) + inject(onRegisterRedirectUrl)
      };
    }
  });

export const keycloakLogoutOptions: InjectionToken<{ redirectUri: string }> =
  new InjectionToken<{ redirectUri: string }>('KeycloakLogoutOptions', {
    providedIn: 'root',
    factory: (): { redirectUri: string } => {
      return {
        redirectUri: inject(baseAppUrl) + inject(onLogoutRedirectUrl)
      };
    }
  });
