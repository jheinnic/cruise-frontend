import {inject, InjectionToken} from '@angular/core';

import {HttpLink, HttpLinkHandler} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

import {apolloGraphQueryUrl, neo4jGraphQueryUrl} from './config-di.tokens';


function provideApolloHttpLink(): HttpLinkHandler {
  return inject(HttpLink).create({
    uri: inject(apolloGraphQueryUrl),
    includeExtensions: true
  });
}

export const apolloHttpLink =
  new InjectionToken<HttpLinkHandler>('ApolloHttpLink', {
    providedIn: 'root',
    factory: provideApolloHttpLink
  });


function provideNeo4jHttpLink(): HttpLinkHandler {
  return inject(HttpLink).create({
    uri: inject(neo4jGraphQueryUrl),
    includeExtensions: true
  });
}

export const neo4jHttpLink =
  new InjectionToken<HttpLinkHandler>('ApolloHttpLink', {
    providedIn: 'root',
    factory: provideNeo4jHttpLink
  });


// by default, this client will send queries to `/graphql` (relative to the URL of your app)
function provideApolloInMemoryCache(): InMemoryCache {
  return new InMemoryCache();
}

export const apolloInMemoryCache =
  new InjectionToken<InMemoryCache>('ApolloInMemoryCache', {
    providedIn: 'root',
    factory: provideApolloInMemoryCache
  });


// export const apolloNgrxCache = new InjectionToken<Cache>('ApolloNgrxCache');

