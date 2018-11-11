import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

// rxjs
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { UserModel } from './../../models/user.model';
import { UserArrayService } from './../../services/user-array.service';

@Component({
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users$: Observable<Array<UserModel>>;
  private editedUser: UserModel;

  constructor(
    private userArrayService: UserArrayService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.users$ = this.userArrayService.getUsers();

    this.route.paramMap
      .pipe(
        switchMap((params: Params) => this.userArrayService.getUser(+params.get('editedUserID')))
      )
      .subscribe(
        (user: UserModel) => {
          this.editedUser = {...user};
          console.log(`Last time you edited user ${JSON.stringify(this.editedUser)}`);
        },
        err => console.log(err)
      );
  }

  onEditUser(user: UserModel): void {
    // const link = ['/users/edit', user.id];
    // this.router.navigate(link);

    const link = ['edit', user.id];
    this.router.navigate(link, { relativeTo: this.route });
  }

  isEdited(user: UserModel) {
    if (this.editedUser) {
      return user.id === this.editedUser.id;
    }
    return false;
  }
}
