import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {Observable} from 'rxjs';
import * as uuid from 'uuid';
import * as chance from 'chance';

import * as fromStore from './store/contacts.reducer';
import {AddContact, DeleteContact} from './store';
import {Contact} from './store';

@Component({
  selector: 'cai-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  public allContacts: Observable<Contact[]>;
  private chance: Chance.Chance;

  constructor(private store: Store<fromStore.State>) {
    this.chance = chance();
  }

  ngOnInit() {
    this.allContacts = this.store.select(
      fromStore.selectAll
    );
  }

  makeOne() {
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    const v4Options = {
      random: [...randomBytes]
    };

    console.log(randomBytes);

    this.store.dispatch(
      new AddContact({
        contact: {
          id: uuid.v4(v4Options),
          name: this.chance.name(),
          size: this.chance.d100(),
          company: this.chance.company(),
          role: this.chance.profession()
        }
      })
    );
  }

  deleteOne(id: string) {
    this.store.dispatch(
      new DeleteContact({ id })
    );
  }
}
