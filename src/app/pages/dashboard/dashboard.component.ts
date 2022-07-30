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
import { NotifierService } from 'angular-notifier';
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
    public userHasProjects: boolean = false;
    public user: TUser = {} as TUser;
    @Input() grab: boolean = true;
    @Input() grabbing: boolean = false;

    constructor(
        public dialog: MatDialog,
        private _router: Router,
        private _storageService: StorageService,
        private _projectService: ProjectService,
        private _taskService: TaskService,
        private _notificationService: NotifierService
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
                if (result.length > 0) {
                    this.tasks = [];
                    this.doing = [];
                    this.done = [];
                    this.projects = result;
                    this.projectId = this.projects[0].projectId as number;
                    this.projectName = this.projects[0].name;
                    this.projectDescription = this.projects[0].description;
                    this.userHasProjects = true;
                } else {
                    this.tasks = [];
                    this.doing = [];
                    this.done = [];
                    this.projects = [];
                    this.projects = [];
                    this.projectId = 0;
                    this.projectName = '';
                    this.projectDescription = '';
                }

                return this.projects;
            })
            .then((projects) => {
                if (this.projects.length > 0) {
                    projects
                        .filter((project: IProject) => project.projectId === this.projectId)
                        .map((project: IProject) => {
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
                }
            })
            .catch((error) => {
                this._notificationService.notify('error', error);
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
                this._notificationService.notify('success', 'Votre tâche a bien été mise à jour !');
            })
            .catch((error) => {
                this._notificationService.notify('error', error.message);
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
        this.tasks = [];
        this.doing = [];
        this.done = [];

        // if (actualProject.tasks?.length === 0) {
        //     this.tasks = [];
        //     this.doing = [];
        //     this.done = [];
        // }

        actualProject.tasks?.map((task: ITask) => {
            switch (true) {
                case task.status === 'todo':
                    this.tasks = [task];
                    break;
                case task.status === 'doing':
                    this.doing = [task];
                    break;
                case task.status === 'done':
                    this.done = [task];
                    break;
                default:
                    break;
            }
        });
    }

    setDeletedButton(value: boolean): void {
        this.isDeletedButton = value;
    }

    openPopup(
        taskId?: number,
        taskName?: string,
        taskDescription?: string,
        taskStatus?: string,
        taskCreatedAt?: string,
        isNewTaskPopup?: boolean,
        isUpdateTaskPopup?: boolean,
        isDeletedTaskPopup?: boolean,
        isNewProjectPopup?: boolean,
        isUpdateProjectPopup?: boolean,
        isDeletedProjectPopup?: boolean,
        projectName?: string,
        projectDescription?: string
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
                    taskStatus,
                    taskCreatedAt,
                    isNewTaskPopup,
                    isUpdateTaskPopup
                );
                break;
            case isNewProjectPopup:
                this.showNewProjectPopup(isNewProjectPopup);
                break;
            case isUpdateProjectPopup:
                this.showUpdateProjectPopup(this.projectId, isUpdateProjectPopup, projectName, projectDescription);
                break;
            case isDeletedProjectPopup:
                this.showDeleteProjectPopup(this.projectId, isDeletedProjectPopup);
                break;
        }
    }

    showNewAndUpdatedTask(
        projectId?: number,
        taskId?: number,
        taskName?: string,
        taskDescription?: string,
        taskStatus?: string,
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
                taskStatus: taskStatus,
                taskCreatedAt: taskCreatedAt,
                isNewTaskPopup: isNewTaskPopup,
                isUpdateTaskPopup: isUpdateTaskPopup,
                user: this.user,
            },
        });

        popupRef.afterClosed().subscribe((result: ITaskPopup) => {
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
            this.getAllProjects();
        });
    }

    showUpdateProjectPopup(
        projectId?: number,
        isUpdateProjectPopup?: boolean,
        projectName?: string,
        projectDescription?: string
    ): void {
        const popupRef = this.dialog.open(PopupComponent, {
            width: '30%',
            data: {
                projectId: projectId,
                projectName: projectName,
                projectDescription: projectDescription,
                isUpdateProjectPopup: isUpdateProjectPopup,
                user: this.user,
            },
        });

        popupRef.afterClosed().subscribe((result) => {
            this.getAllProjects();
        });
    }

    showDeleteProjectPopup(projectId?: number, isDeletedProjectPopup?: boolean) {
        const popupRef = this.dialog.open(PopupComponent, {
            width: '30%',
            data: {
                projectId: projectId,
                isDeletedProjectPopup: isDeletedProjectPopup,
                user: this.user,
            },
        });

        popupRef.afterClosed().subscribe((result) => {
            this.getAllProjects();
            console.log(this.projects.length);
        });
    }

    navigateTo(url: string): void {
        this._router.navigateByUrl(url);
    }
}
