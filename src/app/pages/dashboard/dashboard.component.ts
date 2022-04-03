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
import { ITaskPopup } from 'src/app/interfaces/ITaskPopup';
import { TaskService } from 'src/app/services/task/task.service';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    public tasks: ITask[] = [];
    public doing: ITask[] = [];
    public done: ITask[] = [];
    public projects: IProject[] = [];
    public projectId: number = 0;
    public projectName: string = '';
    public projectDescription: string = '';
    public isDeletedButton: boolean = false;
    public user: TUser = {} as TUser;
    @Input() grab: boolean = true;
    @Input() grabbing: boolean = false;

    constructor(
        public dialog: MatDialog,
        private _router: Router,
        private _storageService: StorageService,
        private _projectService: ProjectService,
        private _taskService: TaskService
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
                this.tasks = [];
                this.doing = [];
                this.done = [];
                this.projects = result;
                this.projectId = this.projects[0].projectId as number;
                this.projectName = this.projects[0].name;
                this.projectDescription = this.projects[0].description;
                return this.projects;
            })
            .then((projects) => {
                projects.map((project: IProject) => {
                    project.tasks?.map((task: ITask) => {
                        switch (true) {
                            case task.status === 'todo':
                                // this.tasks.push(task);
                                this.tasks = [...this.tasks, task];
                                break;
                            case task.status === 'doing':
                                this.doing = [...this.doing, task];
                                break;
                            case task.status === 'done':
                                this.done = [...this.done, task];
                                break;
                            default:
                                break;
                        }
                    });
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    drop(event: CdkDragDrop<ITask[]>) {
        const { data } = event.container;
        const { currentIndex } = event;
        const { className } = event.container.element.nativeElement.parentElement as HTMLElement;

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

        let task: ITask = data[currentIndex];
        this.updateTaskStatus(task, className);
    }

    updateTaskStatus(task: ITask, columnClassName: string) {
        switch (true) {
            case columnClassName === 'todo-column':
                task.status = 'todo';
                break;
            case columnClassName === 'doing-column':
                task.status = 'doing';
                break;
            case columnClassName === 'done-column':
                task.status = 'done';
                break;
            default:
                break;
        }

        this._taskService
            .updateStatus(task, this.user.accessToken)
            .then((res) => {
                console.log(res);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    changeProject(project: IProject): void {
        let actualProject: IProject = this.projectsFiltred(project.projectId as number)[0];
        this.projectId = actualProject.projectId as number;
        this.projectName = project.name;
        this.projectDescription = project.description;
        this.tasksFill(actualProject);
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
        taskId?: number,
        taskName?: string,
        taskDescription?: string,
        taskCreatedAt?: string,
        isNewTaskPopup?: boolean,
        isUpdateTaskPopup?: boolean,
        isDeletedTaskPopup?: boolean,
        isNewProjectPopup?: boolean,
        isUpdateProjectPopup?: boolean
    ): void {
        switch (true) {
            case isDeletedTaskPopup:
                this.showDeletedTaskPopup(isDeletedTaskPopup, taskId);
                break;
            case isNewTaskPopup || isUpdateTaskPopup:
                this.showNewAndUpdatedTask(
                    this.projectId,
                    taskId,
                    taskName,
                    taskDescription,
                    taskCreatedAt,
                    isNewTaskPopup,
                    isUpdateTaskPopup
                );
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
        projectId?: number,
        taskId?: number,
        taskName?: string,
        taskDescription?: string,
        taskCreatedAt?: string,
        isNewTaskPopup?: boolean,
        isUpdateTaskPopup?: boolean
    ): void {
        const popupRef = this.dialog.open(PopupComponent, {
            width: '30%',
            data: {
                projectId: projectId,
                taskId: taskId,
                taskName: taskName,
                taskDescription: taskDescription,
                taskCreatedAt: taskCreatedAt,
                isNewTaskPopup: isNewTaskPopup,
                isUpdateTaskPopup: isUpdateTaskPopup,
                user: this.user,
            },
        });

        popupRef.afterClosed().subscribe((result: ITaskPopup) => {
            // console.log('[ pop up closed ]');
            // console.log(result);
            this.getAllProjects();
        });
    }

    showDeletedTaskPopup(isDeletedTaskPopup?: boolean, taskId?: number): void {
        const popupRef = this.dialog.open(PopupComponent, {
            width: '30%',
            data: {
                taskId: taskId,
                title: 'Task deleted',
                isDeletedTaskPopup: isDeletedTaskPopup,
                user: this.user,
            },
        });

        popupRef.afterClosed().subscribe((result) => {
            console.log('[ pop up closed ]');
            console.log(result);
            this.getAllProjects();
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
            // console.log('[ pop up closed ]');
            // console.log(result);
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
            // console.log('[ pop up closed ]');
            // console.log(result);
            this.getAllProjects();
        });
    }

    navigateTo(url: string): void {
        this._router.navigateByUrl(url);
    }
}
