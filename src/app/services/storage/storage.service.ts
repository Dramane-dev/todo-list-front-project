import { Injectable } from '@angular/core';

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
}
