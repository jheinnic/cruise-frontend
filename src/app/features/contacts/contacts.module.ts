import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';

import * as fromContact from './store/contacts.reducer';
import {ContactsRoutingModule} from './contacts-routing.module';
import {ContactsComponent} from './contacts.component';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [ContactsComponent],
  imports: [
    SharedModule,
    StoreModule.forFeature(fromContact.featureKey, fromContact.reducer),
    ContactsRoutingModule,
  ]
})
export class ContactsModule {}
