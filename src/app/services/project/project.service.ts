import { Injectable } from '@angular/core';
import axios, { AxiosRequestHeaders } from 'axios';
import { IProject } from 'src/app/interfaces/IProject';
import { environment } from 'src/environments/environment';
import { AddTokenToHeaderService } from '../requests/add-token-to-header.service';

let axiosInstance = axios.create({
    headers: {},
});
@Injectable({
    providedIn: 'root',
})
export class ProjectService {
    constructor(private _addTokenToHeaderService: AddTokenToHeaderService) {}

    getAllProjects(userId: string, token: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            axios
                .get(environment.globalBackendUrl + 'projects/' + userId, {
                    headers: await this._addTokenToHeaderService.addToken(token),
                })
                .then((projects) => {
                    resolve(projects);
                })
                .catch((error) => {
                    const { status, data } = error.response;
                    reject({
                        status: status,
                        message: data.message,
                    });
                });
        });
    }

    getProjectById(projectId: string, token: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            axios
                .get(environment.globalBackendUrl + 'project/' + projectId, {
                    headers: await this._addTokenToHeaderService.addToken(token),
                })
                .then((project) => {
                    resolve(project);
                })
                .catch((error) => {
                    const { status, data } = error.response;
                    reject({
                        status: status,
                        message: data.message,
                    });
                });
        });
    }

    createProject(project: IProject, token: string, userId: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            axios
                .post(environment.globalBackendUrl + 'project/' + userId, project, {
                    headers: await this._addTokenToHeaderService.addToken(token),
                })
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    const { status, data } = error.response;
                    reject({
                        status: status,
                        message: data.message,
                    });
                });
        });
    }

    updateProject(projectId: string, project: any, token: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            axios
                .put(environment.globalBackendUrl + 'project/' + projectId, project, {
                    headers: await this._addTokenToHeaderService.addToken(token),
                })
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    const { status, data } = error.response;
                    reject({
                        status: status,
                        message: data.message,
                    });
                });
        });
    }

    deleteProject(projectId: string, token: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            axios
                .delete(environment.globalBackendUrl + 'project/' + projectId, {
                    headers: await this._addTokenToHeaderService.addToken(token),
                })
                .then((res) => {
                    resolve(res);
                })
                .catch((error) => {
                    const { status, data } = error.response;
                    reject({
                        status: status,
                        message: data.message,
                    });
                });
        });
    }
}
