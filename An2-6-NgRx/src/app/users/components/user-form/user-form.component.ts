import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as RouterActions from './../../../core/+store/router/router.actions';
import * as UsersActions from './../../../core/+store/users/users.actions';
import { AutoUnsubscribe, DialogService, CanComponentDeactivate } from './../../../core';
import { UserModel } from './../../models/user.model';
import { AppState, getUsersOriginalUser, getSelectedUserByUrl } from './../../../core/+store';

@Component({
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
@AutoUnsubscribe()
export class UserFormComponent implements OnInit, CanComponentDeactivate {
  private sub: Subscription;
  user: UserModel;

  constructor(private store: Store<AppState>, private dialogService: DialogService) {}

  ngOnInit(): void {
    this.sub = this.store
      .pipe(select(getSelectedUserByUrl))
      .subscribe(user => this.user = user);
  }

  onSaveUser() {
    const user = { ...this.user };

    user.id
      ? this.store.dispatch(new UsersActions.UpdateUser(user))
      : this.store.dispatch(new UsersActions.CreateUser(user));
  }

  onGoBack() {
    this.store.dispatch(new RouterActions.Back());
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    const flags = [];

    return this.store.pipe(
      select(getUsersOriginalUser),
      switchMap(originalUser => {
        for (const key in originalUser) {
          if (originalUser[key] === this.user[key]) {
            flags.push(true);
          } else {
            flags.push(false);
          }
        }

        if (flags.every(el => el)) {
          return of(true);
        }

        return this.dialogService.confirm('Discard changes?');
      })
    );
  }
}
