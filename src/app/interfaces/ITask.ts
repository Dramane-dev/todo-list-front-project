export interface ITask {
    id: number;
    status?: string;
    name: string;
    description: string;
    created_at: string;
    projectId: number;
}
