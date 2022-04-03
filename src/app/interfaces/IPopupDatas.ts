import { TUser } from '../types/TUser';

export interface IDataPopup {
    taskId: number;
    taskName: string;
    taskDescription: string;
    taskCreatedAt: string;
    isNewTaskPopup: boolean;
    isUpdateTaskPopup: boolean;
    taskDeleted: boolean;
    title: string;
    isDeletedTaskPopup: boolean;
    projectId: number;
    projectName: string;
    projectDescription: string;
    isNewProjectPopup: boolean;
    isUpdateProjectPopup: boolean;
    user: TUser;
}
