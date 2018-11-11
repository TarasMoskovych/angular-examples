import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TaskComponent, TaskFormComponent, TaskListComponent } from './components';
import { TasksServicesModule } from './tasks-services.module';

import { StoreModule } from '@ngrx/store';
import { tasksReducer, TasksEffects } from './../core/+store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [TaskListComponent, TaskFormComponent, TaskComponent],
  imports: [CommonModule,
    FormsModule,
    TasksRoutingModule,
    TasksServicesModule,
    StoreModule.forFeature('tasks', tasksReducer),
    EffectsModule.forFeature([TasksEffects])
  ],
  providers: []
})
export class TasksModule {}
