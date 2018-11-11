import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs';
import { concatMap, switchMap, pluck, map } from 'rxjs/operators';

import * as TasksActions from './tasks.actions';
import * as RouterActions from './../router/router.actions';
import { TaskPromiseService } from './../../../tasks/services';
import { TaskModel } from '../../../tasks/models/task.model';

@Injectable()
export class TasksEffects {
  constructor(
    private actions$: Actions,
    private taskPromiseService: TaskPromiseService
  ) {
    console.log('[TASKS EFFECTS]');
  }

  @Effect()
  getTasks$: Observable<Action> = this.actions$.pipe(
    // Instead of ofType<TasksActions.GetTasks>(...) you can use ofType(...)
    // It's optional.
    // Specify the action type to allow type-safe mapping to other data on the action,
    // including payload
    ofType<TasksActions.GetTasks>(TasksActions.TasksActionTypes.GET_TASKS),
    switchMap((action: TasksActions.GetTasks) =>
      this.taskPromiseService
        .getTasks()
        .then(tasks => new TasksActions.GetTasksSuccess(tasks))
        .catch(err => new TasksActions.GetTasksError(err))
    )
  );

  @Effect()
  updateTask$: Observable<Action> = this.actions$.pipe(
    ofType<TasksActions.UpdateTask>(TasksActions.TasksActionTypes.UPDATE_TASK),
    pluck('payload'),
    concatMap((payload: TaskModel) =>
      this.taskPromiseService
        .updateTask(payload)
        .then(task => new TasksActions.UpdateTaskSuccess(task))
        .catch(err => new TasksActions.UpdateTaskError(err))
    )
  );

  @Effect()
  createTask$: Observable<Action> = this.actions$.pipe(
    ofType<TasksActions.CreateTask>(TasksActions.TasksActionTypes.CREATE_TASK),
    pluck('payload'),
    concatMap((payload: TaskModel) =>
      this.taskPromiseService
        .createTask(payload)
        .then(task => new TasksActions.CreateTaskSuccess(task))
        .catch(err => new TasksActions.CreateTaskError(err))
    )
  );

  @Effect()
  deleteTask$: Observable<Action> = this.actions$.pipe(
    ofType<TasksActions.DeleteTask>(TasksActions.TasksActionTypes.DELETE_TASK),
    pluck('payload'),
    concatMap((payload: TaskModel) =>
      this.taskPromiseService
        .deleteTask(payload)
        .then(() => new TasksActions.DeleteTaskSuccess(payload))
        .catch(err => new TasksActions.DeleteTaskError(err))
    )
  );

  @Effect()
  createUpdateTaskSuccess$: Observable<Action> = this.actions$.pipe(
    ofType<TasksActions.CreateTask | TasksActions.UpdateTask>(
      TasksActions.TasksActionTypes.CREATE_TASK_SUCCESS,
      TasksActions.TasksActionTypes.UPDATE_TASK_SUCCESS
    ),
    map(action => new RouterActions.Go({ path: ['/home'] }))
  );
}
