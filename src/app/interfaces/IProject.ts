import { ITask } from './ITask';

export interface IProject {
    projectId?: number;
    name: string;
    description: string;
    tasks?: ITask[];
    userId?: number;
}
