import { TUser } from '../types/TUser';

export interface ITaskPopup {
    isNewTaskPopup: boolean;
    isUpdateTaskPopup: boolean;
    taskDescription: string;
    taskName: string;
    user: TUser;
}
