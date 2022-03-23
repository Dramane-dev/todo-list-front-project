import { Component, EventEmitter, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { ProjectService } from 'src/app/services/project/project.service';
import { IDataPopup } from 'src/app/interfaces/IPopupDatas';
import { IProject } from 'src/app/interfaces/IProject';

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
    public taskName: string = '';
    public taskDescription: string = '';
    public projectName: string = '';

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
        private _projectService: ProjectService
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
        this.projectName = this.data.projectName;
        this.taskForm.get('taskName')?.setValue(this.data.taskName);
        this.taskForm.get('taskDescription')?.setValue(this.data.taskDescription);
    }

    popupClosed(): void {
        this.popupRef.close();
    }

    createTask(): void {
        const { taskName, taskDescription } = this.projectForm.controls;
        this.data.taskName = taskName.value;
        this.data.taskDescription = taskDescription.value;
    }

    updateTask(): void {
        const { taskName, taskDescription } = this.projectForm.controls;
        this.data.taskName = taskName.value;
        this.data.taskDescription = taskDescription.value;
    }

    deleteTask(): void {
        this.data.taskDeleted = true;
    }

    createProject(): void {
        const { projectName, projectDescription } = this.projectForm.controls;

        console.log(projectName.value);
        console.log(projectDescription.value);

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
                .then((res) => {
                    console.log(res);
                    // this.newProject.emit(true);
                })
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
    }
}
