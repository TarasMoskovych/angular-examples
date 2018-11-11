import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as RouterActions from './../../../core/+store/router/router.actions';
import * as TasksActions from './../../../core/+store/tasks/tasks.actions';

import { TaskModel } from './../../models/task.model';
import { AppState, getTasksData, getTasksError } from './../../../core/+store';

@Component({
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<ReadonlyArray<TaskModel>>;
  tasksError$: Observable<Error | string>;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    console.log('We have a store! ', this.store);

    this.tasks$ = this.store.pipe(select(getTasksData));
    this.tasksError$ = this.store.pipe(select(getTasksError));
  }

  onCreateTask() {
    this.store.dispatch(new RouterActions.Go({ path: ['/add'] }));
  }

  onCompleteTask(task: TaskModel): void {
    const doneTask = { ...task, done: true };
    this.store.dispatch(new TasksActions.UpdateTask(doneTask));
  }

  onEditTask(task: TaskModel): void {
    this.store.dispatch(new RouterActions.Go({ path: ['/edit', task.id] }));
  }

  onDeleteTask(task: TaskModel) {
    this.store.dispatch(new TasksActions.DeleteTask(task));
  }
}
