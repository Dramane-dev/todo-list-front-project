import { Component, EventEmitter, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { ProjectService } from 'src/app/services/project/project.service';
import { IDataPopup } from 'src/app/interfaces/IPopupDatas';
import { IProject } from 'src/app/interfaces/IProject';
import { TaskService } from 'src/app/services/task/task.service';
import { IUpdateProject } from 'src/app/interfaces/IUpdateProject';

@Component({
    selector: 'app-popup',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss'],
})
export class PopupComponent implements OnInit {
    public isUpdateTaskPopup: boolean = false;
    public isNewTaskPopup: boolean = false;
    public isDeletedTaskPopup: boolean = false;
    public isNewProjectPopup: boolean = false;
    public isUpdateProjectPopup: boolean = false;
    public taskId: number = 0;
    public taskName: string = '';
    public taskDescription: string = '';
    public taskCreatedAt: string = '';
    public projectId: number = 0;
    public projectName: string = '';
    public projectDescription: string = '';

    taskForm: FormGroup = new FormGroup({
        taskName: new FormControl(''),
        taskDescription: new FormControl(''),
    });

    projectForm: FormGroup = new FormGroup({
        projectName: new FormControl(''),
        projectDescription: new FormControl(''),
    });

    constructor(
        public popupRef: MatDialogRef<PopupComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: IDataPopup,
        private _projectService: ProjectService,
        private _taskService: TaskService
    ) {}

    ngOnInit(): void {
        this.initBooleanView();
    }

    initBooleanView(): void {
        this.isNewTaskPopup = this.data.isNewTaskPopup;
        this.isUpdateTaskPopup = this.data.isUpdateTaskPopup;
        this.isDeletedTaskPopup = this.data.isDeletedTaskPopup;
        this.isNewProjectPopup = this.data.isNewProjectPopup;
        this.isUpdateProjectPopup = this.data.isUpdateProjectPopup;
        this.projectId = this.data.projectId;
        this.taskId = this.data.taskId;
        this.projectName = this.data.projectName;
        this.projectDescription = this.data.projectDescription;
        this.projectForm.get('projectName')?.setValue(this.data.projectName);
        this.projectForm.get('projectDescription')?.setValue(this.data.projectDescription);
        this.taskForm.get('taskName')?.setValue(this.data.taskName);
        this.taskForm.get('taskDescription')?.setValue(this.data.taskDescription);
        this.taskCreatedAt = this.data.taskCreatedAt;
    }

    popupClosed(): void {
        this.popupRef.close();
    }

    createTask(): void {
        const { taskName, taskDescription } = this.taskForm.controls;
        this.data.taskName = taskName.value;
        this.data.taskDescription = taskDescription.value;

        this._taskService
            .create(
                {
                    id: 0,
                    name: taskName.value,
                    description: taskDescription.value,
                    created_at: '',
                    projectId: this.projectId,
                    status: this.data.taskStatus,
                },
                this.projectId,
                this.data.user.accessToken
            )
            .then((result) => {})
            .catch((error) => {
                console.log(error);
            });
    }

    updateTask(): void {
        const { taskName, taskDescription } = this.taskForm.controls;
        this.data.taskName = taskName.value;
        this.data.taskDescription = taskDescription.value;

        this._taskService
            .update(
                {
                    id: this.taskId,
                    name: taskName.value,
                    description: taskDescription.value,
                    status: this.data.taskStatus,
                    created_at: this.taskCreatedAt,
                    projectId: this.projectId,
                },
                this.projectId,
                this.data.user.accessToken
            )
            .then((res) => {})
            .catch((error) => {
                console.log(error.message);
            });
    }

    deleteTask(): void {
        this.data.taskDeleted = true;
        this._taskService
            .delete(this.taskId, this.data.user.accessToken)
            .then((res) => {})
            .catch((error) => {
                console.log(error.message);
            });
    }

    createProject(): void {
        const { projectName, projectDescription } = this.projectForm.controls;

        if (this.projectForm.valid) {
            this._projectService
                .createProject(
                    {
                        name: projectName.value,
                        description: projectDescription.value,
                    },
                    this.data.user.accessToken,
                    String(this.data.user.userId)
                )
                .then((res) => {})
                .catch((error) => {
                    console.log(error);
                });

            this.data.projectName = projectName.value;
            this.data.projectDescription = projectDescription.value;
        }
    }

    updateProject(): void {
        const { projectName, projectDescription } = this.projectForm.controls;
        this.data.projectName = projectName.value;
        this.data.projectDescription = projectDescription.value;
        let project: IUpdateProject = {
            projectName: projectName.value,
            projectDescription: projectDescription.value,
        };

        this._projectService
            .updateProject(this.projectId, project, this.data.user.accessToken)
            .then((res) => {})
            .catch((error) => {
                console.log(error.message);
            });
    }
}
