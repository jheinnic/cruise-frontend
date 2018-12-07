import {Component, Input} from '@angular/core';
import {Store} from '@ngrx/store';
import {NGXLogger} from 'ngx-logger';
import {Observable} from 'rxjs';

import {NavbarTemplateDirective} from './navbar-template.directive';
import {CoreFeature} from '../../core/store/reducers';
import * as RootStore from '../../store';

@Component({
  selector: 'cai-navbar',
  template: `
    <ng-container *ngIf="navbarTemplate | async as activeTemplate">
      <ng-template [cdkPortalOutlet]="activeTemplate"></ng-template>
    </ng-container>
  `,
  styleUrls: ['./navbar.component.css']

})
export class NavbarComponent {
  public readonly navbarTemplate: Observable<NavbarTemplateDirective>;

  constructor(private store: Store<RootStore.State>, private logger: NGXLogger) {
    this.logger.info('Navbar Component constructor');
    this.navbarTemplate = this.store.select(CoreFeature.selectActiveNavbarTemplate);
  }
}
