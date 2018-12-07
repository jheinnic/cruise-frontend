import {RouterStateSnapshot} from '@angular/router';
import {RouterStateSerializer} from '@ngrx/router-store';

import {RouterStateModels} from './models/index';
import RouterStateUrl = RouterStateModels.RouterStateUrl;


export class CustomRouterStateSerializerService
  implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const {url} = routerState;
    const {queryParams, params, queryParamMap, paramMap, data} = routerState.root;
    // const queryParams = routerState.root.queryParams;
    // const params = routerState.root.params;
    // const queryParamMap = routerState.root.queryParamMap;
    // const paramMap = routerState.root.paramMap;
    // const data = routerState.root.data;

    const retVal = {url, queryParams, params, queryParamMap, paramMap, data};
    console.log(retVal);

    return retVal;
  }
}
