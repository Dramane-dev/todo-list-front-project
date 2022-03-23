import { Injectable } from '@angular/core';
import { AxiosRequestHeaders } from 'axios';
import { TUser } from 'src/app/types/TUser';
import { StorageService } from '../storage/storage.service';

@Injectable({
    providedIn: 'root',
})
export class AddTokenToHeaderService {
    constructor(private _storageService: StorageService) {}

    async addToken(token: string): Promise<AxiosRequestHeaders> {
        if (token) {
            return { authorization: 'Bearer ' + token };
        }
        return {};
    }
}
