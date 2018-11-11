import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as RouterActions from './../../../core/+store/router/router.actions';
import * as UsersActions from './../../../core/+store/users/users.actions';

import { UserModel } from './../../models/user.model';
import { AppState, getUsers, getUsersError, getEditedUser } from './../../../core/+store';
import { AutoUnsubscribe } from './../../../core/decorators';

@Component({
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
@AutoUnsubscribe('subscription')
export class UserListComponent implements OnInit {
  private subscription: Subscription;
  private editedUser: UserModel;
  users$: Observable<Array<UserModel>>;
  usersError$: Observable<Error | string>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.users$ = this.store.pipe(select(getUsers));
    this.usersError$ = this.store.pipe(select(getUsersError));

    // listen editedUserID from UserFormComponent
    this.subscription = this.store.pipe(select(getEditedUser))
      .subscribe(
        user => {
          this.editedUser = user;
          console.log(`Last time you edited user ${JSON.stringify(this.editedUser)}`);
        },
        err => console.log(err)
    );
  }

  onEditUser(user: UserModel) {
    this.store.dispatch(new RouterActions.Go({ path: ['/users/edit', user.id] }));
  }

  isEdited(user: UserModel) {
    if (this.editedUser) {
      return user.id === this.editedUser.id;
    }
    return false;
  }

  onDeleteUser(user: UserModel) {
    this.store.dispatch(new UsersActions.DeleteUser(user));
  }
}
