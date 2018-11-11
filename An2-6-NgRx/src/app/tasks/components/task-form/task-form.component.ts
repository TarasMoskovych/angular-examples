import { Component, OnInit } from '@angular/core';

import { Store, select } from '@ngrx/store';

import { Subscription } from 'rxjs';

import * as RouterActions from './../../../core/+store/router/router.actions';
import * as TasksActions from './../../../core/+store/tasks/tasks.actions';

import { AppState, getSelectedTaskByUrl } from './../../../core/+store';
import { TaskModel } from './../../models/task.model';
import { AutoUnsubscribe } from './../../../core';

@Component({
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
@AutoUnsubscribe()
export class TaskFormComponent implements OnInit {
  private sub: Subscription;
  task: TaskModel;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.sub = this.store
      .pipe(select(getSelectedTaskByUrl))
      .subscribe(task => this.task = task);
  }

  onSaveTask() {
    const task = { ...this.task };

    task.id
      ? this.store.dispatch(new TasksActions.UpdateTask(task))
      : this.store.dispatch(new TasksActions.CreateTask(task));
  }

  onGoBack(): void {
    this.store.dispatch(new RouterActions.Go({ path: ['/home'] }));
  }
}
