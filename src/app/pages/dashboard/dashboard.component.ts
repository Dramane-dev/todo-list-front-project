import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    public todos: string[] = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
    public doing: string[] = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
    public done: string[] = ['Get up up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
    public projects: string[] = ['Projet 1', 'Projet 2', 'Projet 3', 'Projet 4', 'projet 5'];
    public projectName: string = "Développement de l'appli todo list";
    public isDeletedButton: boolean = false;
    @Input() grab: boolean = true;
    @Input() grabbing: boolean = false;

    constructor(public dialog: MatDialog, private _router: Router) {}

    ngOnInit(): void {}

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
        }
    }

    changeProjectTitle(projectName: string): void {
        console.log(projectName);
        this.projectName = projectName;
    }

    setDeletedButton(value: boolean): void {
        this.isDeletedButton = value;
        console.log(this.isDeletedButton);
    }

    openUpdateTaskPopup(
        taskName?: string,
        taskDescription?: string,
        isNewTaskPopup?: boolean,
        isUpdateTaskPopup?: boolean,
        isDeletedTaskPopup?: boolean,
        isNewProjectPopup?: boolean
    ): void {
        switch (true) {
            case isDeletedTaskPopup:
                this.showDeletedTaskPopup(isDeletedTaskPopup);
                break;
            case isNewTaskPopup || isUpdateTaskPopup:
                this.showNewAndUpdatedTask(taskName, taskDescription, isNewTaskPopup, isUpdateTaskPopup);
                break;
            case isNewProjectPopup:
                this.showNewProjectPopup(isNewProjectPopup);
                break;
        }
    }

    showNewAndUpdatedTask(
        taskName?: string,
        taskDescription?: string,
        isNewTaskPopup?: boolean,
        isUpdateTaskPopup?: boolean
    ): void {
        const popupRef = this.dialog.open(PopupComponent, {
            width: '30%',
            data: {
                taskName: taskName,
                taskDescription: taskDescription,
                isNewTaskPopup: isNewTaskPopup,
                isUpdateTaskPopup: isUpdateTaskPopup,
            },
        });

        popupRef.afterClosed().subscribe((result) => {
            console.log('[ pop up closed ]');
            console.log(result);
        });
    }

    showDeletedTaskPopup(isDeletedTaskPopup?: boolean): void {
        const popupRef = this.dialog.open(PopupComponent, {
            width: '30%',
            data: {
                title: 'Task deleted',
                isDeletedTaskPopup: isDeletedTaskPopup,
            },
        });

        popupRef.afterClosed().subscribe((result) => {
            console.log('[ pop up closed ]');
            console.log(result);
        });

        this.isDeletedButton = false;
    }

    showNewProjectPopup(isNewProjectPopup?: boolean): void {
        const popupRef = this.dialog.open(PopupComponent, {
            width: '30%',
            data: {
                projectName: '',
                projectDescription: '',
                isNewProjectPopup: isNewProjectPopup,
            },
        });

        popupRef.afterClosed().subscribe((result) => {
            console.log('[ pop up closed ]');
            console.log(result);
        });
    }

    navigateTo(url: string): void {
        this._router.navigateByUrl(url);
    }
}
