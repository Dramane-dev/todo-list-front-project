import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  public isUpdateTaskPopup: boolean = false;
  public isNewTaskPopup: boolean = false;
  public isDeletedTaskPopup: boolean = false;
  public isNewProjectPopup: boolean = false;
  public taskName: string = "";
  public taskDescription: string = "";

  taskForm: FormGroup = new FormGroup({
    taskName: new FormControl(''),
    taskDescription: new FormControl('')
  });

  newProjectForm: FormGroup = new FormGroup({
    projectName: new FormControl('')
  });

  constructor(
    public popupRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initBooleanView();
  }

  initBooleanView(): void {
    this.isNewTaskPopup = this.data.isNewTaskPopup;
    this.isUpdateTaskPopup = this.data.isUpdateTaskPopup;
    this.isDeletedTaskPopup = this.data.isDeletedTaskPopup;
    this.isNewProjectPopup = this.data.isNewProjectPopup;
  }

  popupClosed(): void {
    this.popupRef.close();
  }

  createTask(): void {
    this.data.taskName = this.taskForm.value.taskName;
    this.data.taskDescription = this.taskForm.value.taskDescription;
  }

  updateTask(): void {
    this.data.taskName = this.taskForm.value.taskName;
    this.data.taskDescription = this.taskForm.value.taskDescription;
  }

  deleteTask(): void {
    this.data.taskDeleted = true;
  }

  createProject(): void {
    this.data.projectName = this.newProjectForm.value.projectName;
  }
}
