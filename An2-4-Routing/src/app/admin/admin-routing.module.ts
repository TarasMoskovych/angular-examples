import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './../core';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent, ManageTasksComponent, ManageUsersComponent } from './components';

export const adminRouterComponents = [
  AdminComponent,
  AdminDashboardComponent,
  ManageTasksComponent,
  ManageUsersComponent
];

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'users', component: ManageUsersComponent },
          { path: 'tasks', component: ManageTasksComponent },
          { path: '', component: AdminDashboardComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
