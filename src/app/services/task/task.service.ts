import { Injectable } from '@angular/core';
import axios from 'axios';
import { ITask } from 'src/app/interfaces/ITask';
import { environment } from 'src/environments/environment';
import { AddTokenToHeaderService } from '../requests/add-token-to-header.service';

@Injectable({
    providedIn: 'root',
})
export class TaskService {
    constructor(private _addTokenToHeaderService: AddTokenToHeaderService) {}

    create(task: ITask, projectId: number, token: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            axios
                .post(environment.globalBackendUrl + 'task/' + projectId, task, {
                    headers: await this._addTokenToHeaderService.addToken(token),
                })
                .then((result) => {
                    const { message, task } = result.data;
                    resolve(message);
                })
                .catch((error) => {
                    const { data } = error.response;
                    reject({
                        message: data.message,
                    });
                });
        });
    }

    update(task: ITask, projectId: number, token: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            axios
                .put(environment.globalBackendUrl + 'task/' + task.id, task, {
                    headers: await this._addTokenToHeaderService.addToken(token),
                })
                .then((result) => {
                    const { message, task } = result.data;
                    resolve(message);
                })
                .catch((error) => {
                    const { data } = error.response;
                    reject({
                        message: data.message,
                    });
                });
        });
    }

    updateStatus(task: ITask, token: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            axios
                .put(environment.globalBackendUrl + 'task/' + task.id, task, {
                    headers: await this._addTokenToHeaderService.addToken(token),
                })
                .then((result) => {
                    const { message, task } = result.data;
                    resolve(message);
                })
                .catch((error) => {
                    const { data } = error.response;
                    reject({
                        message: data.message,
                    });
                });
        });
    }

    delete(taskId: number, token: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            axios
                .delete(environment.globalBackendUrl + 'task/' + taskId, {
                    headers: await this._addTokenToHeaderService.addToken(token),
                })
                .then((result) => {
                    const { message, task } = result.data;
                    resolve(task);
                })
                .catch((error) => {
                    const { data } = error.response;
                    reject({
                        message: data.message,
                    });
                });
        });
    }
}
