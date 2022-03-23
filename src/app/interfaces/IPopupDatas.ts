import { TUser } from '../types/TUser';

export interface IDataPopup {
    taskName: string;
    taskDescription: string;
    isNewTaskPopup: boolean;
    isUpdateTaskPopup: boolean;
    taskDeleted: boolean;
    title: string;
    isDeletedTaskPopup: boolean;
    projectName: string;
    projectDescription: string;
    isNewProjectPopup: boolean;
    isUpdateProjectPopup: boolean;
    user: TUser;
}
