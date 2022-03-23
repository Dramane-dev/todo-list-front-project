import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from 'src/app/components/popup/popup.component';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TUser } from 'src/app/types/TUser';
import { ProjectService } from 'src/app/services/project/project.service';
import { IProject } from 'src/app/interfaces/IProject';
import { ITask } from '../../interfaces/ITask';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    public tasks: ITask[] = [];
    public doing: ITask[] = [
        {
            name: 'TEST',
            description: 'DESCRIPTION',
            createdAt: '12/12/2022',
        },
    ];
    public done: ITask[] = [];
    public projects: IProject[] = [];
    public projectName: string = "Développement de l'appli todo list";
    public projectDescription: string = '';
    public isDeletedButton: boolean = false;
    public user: TUser = {} as TUser;
    @Input() grab: boolean = true;
    @Input() grabbing: boolean = false;

    constructor(
        public dialog: MatDialog,
        private _router: Router,
        private _storageService: StorageService,
        private _projectService: ProjectService
    ) {}

    ngOnInit(): void {
        this._storageService
            .getFromLocalStorage('userInformations')
            .then((res) => {
                this.user = JSON.parse(res);
            })
            .then(() => {
                this.getAllProjects();
            });
    }

    getAllProjects() {
        this._projectService
            .getAllProjects(String(this.user.userId), this.user.accessToken)
            .then((res) => {
                const { message, result } = res.data;
                result.map((project: IProject) => {
                    this.projects = [...this.projects, project];
                });
                this.projectName = this.projects[0].name;
                this.projectDescription = this.projects[0].description;
                console.log(this.projects);
                return result;
            })
            .then((todos) => {})
            .catch((error) => {
                console.log(error);
            });
    }

    drop(event: CdkDragDrop<ITask[]>) {
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

    changeProject(project: IProject): void {
        let actualProject: IProject = this.projectsFiltred(project.projectId as number)[0];
        this.projectName = project.name;
        this.projectDescription = project.description;
        this.tasksFill(actualProject);
        console.log(this.tasks);
    }

    projectsFiltred(projectId: number): IProject[] {
        return this.projects.filter((project: IProject) => project.projectId === projectId);
    }

    tasksFill(actualProject: IProject) {
        actualProject.tasks?.map((task: ITask) => {
            this.tasks.push(task);
        });
    }

    setDeletedButton(value: boolean): void {
        this.isDeletedButton = value;
    }

    openPopup(
        taskName?: string,
        taskDescription?: string,
        isNewTaskPopup?: boolean,
        isUpdateTaskPopup?: boolean,
        isDeletedTaskPopup?: boolean,
        isNewProjectPopup?: boolean,
        isUpdateProjectPopup?: boolean
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
            case isUpdateProjectPopup:
                this.showUpdateProjectPopup(isUpdateProjectPopup);
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
                user: this.user,
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
                user: this.user,
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
                user: this.user,
            },
        });

        popupRef.afterClosed().subscribe((result) => {
            console.log('[ pop up closed ]');
            console.log(result);
            this.getAllProjects();
        });
    }

    showUpdateProjectPopup(isUpdateProjectPopup?: boolean): void {
        const popupRef = this.dialog.open(PopupComponent, {
            width: '30%',
            data: {
                projectName: '',
                projectDescription: '',
                isUpdateProjectPopup: isUpdateProjectPopup,
                user: this.user,
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
