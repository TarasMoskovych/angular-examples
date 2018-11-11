import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { RouterStateSerializerProvider, routerReducers, RouterEffects } from './router';
import { environment } from './../../../environments/environment';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(routerReducers),
    EffectsModule.forRoot([RouterEffects]),
    StoreRouterConnectingModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ],
  providers: [RouterStateSerializerProvider]
})
export class CoreStoreModule { }
