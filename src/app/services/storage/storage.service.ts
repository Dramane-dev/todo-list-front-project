import { Injectable } from '@angular/core';
import { TUser } from 'src/app/types/TUser';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    private _storage: Storage = window.localStorage;

    constructor() {}

    saveFromLocalStorage(key: string, value: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            await this._storage.setItem(key, value);
            resolve(true);
        });
    }

    getFromLocalStorage(key: string): Promise<string> {
        return new Promise((resolve, reject) => {
            resolve(this._storage.getItem(key) as string);
        });
    }

    updateFromLocalStorage(key: string, value: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._storage.setItem(key, value);
            resolve(true);
        });
    }

    removeFromLocalStorage(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._storage.removeItem(key);
            resolve(true);
        });
    }

    userIsAuthenticated(key: string): boolean {
        let actualUser: TUser = JSON.parse(this._storage.getItem(key) as string);
        return actualUser.isAuthenticated;
    }

    getUserAccessToken(key: string): string {
        let actualUser: TUser = JSON.parse(this._storage.getItem(key) as string);

        if (actualUser && actualUser.accessToken) {
            return actualUser.accessToken;
        }

        return '';
    }
}
