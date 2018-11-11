import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from './../shared/shared.module';
import { UsersServicesModule } from './users-services.module';

import { UsersRoutingModule, usersRouterComponents } from './users-routing.module';
import { UserComponent } from './components';
import { UsersAPIProvider } from './users.config';

import { UsersEffects, usersReducer } from './../core/+store';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    UsersRoutingModule,
    UsersServicesModule,
    StoreModule.forFeature('users', usersReducer),
    EffectsModule.forFeature([UsersEffects])
  ],
  providers: [UsersAPIProvider],
  declarations: [usersRouterComponents, UserComponent]
})
export class UsersModule {}
