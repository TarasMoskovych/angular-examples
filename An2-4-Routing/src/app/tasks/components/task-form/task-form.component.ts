import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { TaskModel } from './../../models/task.model';
import { TaskArrayService } from './../../services/task-array.service';

@Component({
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  task: TaskModel;

  constructor(
    private taskArrayService: TaskArrayService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.task = new TaskModel();

    this.route.paramMap
      .pipe(
        switchMap((params: Params) => this.taskArrayService.getTask(+params.get('taskID'))))
      .subscribe(
        task => this.task = {...task},
        err => console.log(err)
    );
  }

  onSaveTask() {
    const task = { ...this.task };
    if (task.id) {
      this.taskArrayService.updateTask(task);
    } else {
      this.taskArrayService.createTask(task);
    }
    this.onGoBack();
  }

  onGoBack(): void {
    this.router.navigate(['/home']);
  }
}
