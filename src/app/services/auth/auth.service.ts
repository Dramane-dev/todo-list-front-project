import { Injectable } from '@angular/core';
import axios from 'axios';
import { User } from 'src/app/interfaces/User';
import { TSigninResponse } from 'src/app/types/TSigninResponse';
import { TUser } from 'src/app/types/TUser';
import { TUserCredential } from 'src/app/types/TUserCredential';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor() {}

    signup(
        lastname: string,
        firstname: string,
        email: string,
        password: string,
        confirmedPassword: string
    ): Promise<TUser> {
        return new Promise((resolve, reject) => {
            let user: User = {
                lastname,
                firstname,
                email,
                password,
                confirmedPassword,
            };
            axios
                .post(environment.globalBackendUrl + 'signup', user)
                .then((res) => {
                    console.log(res);
                    resolve(res.data.user);
                })
                .catch((error) => {
                    const { status, data } = error.response;
                    console.log(data);
                    reject(data.message);
                });
        });
    }

    verifyMailCode(mailVerificationCode: string, userId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            axios
                .post(environment.globalBackendUrl + 'verify-mail/' + userId, {
                    mailVerificationCode: mailVerificationCode,
                })
                .then(() => {
                    resolve(true);
                })
                .catch((error) => {
                    const { status, data } = error.response;
                    console.log(data);
                    reject(data.message);
                });
        });
    }

    signin(userCredentials: TUserCredential): Promise<TSigninResponse> {
        return new Promise((resolve, reject) => {
            axios
                .post(environment.globalBackendUrl + 'signin', userCredentials)
                .then((res) => {
                    const { message } = res.data;
                    if (message.includes('User connected successfuly')) {
                        resolve(res.data);
                    }
                })
                .catch((error) => {
                    const { status, data } = error.response;
                    reject(data.message);
                });
        });
    }

    isAuthenticated(user: TUser): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            let headerRequest: string | boolean = await this.addUserTokenToHeader(user);

            if (headerRequest) {
                axios
                    .get(environment.globalBackendUrl + 'is-authenticated/' + user.userId, {
                        headers: {
                            Authorization: headerRequest,
                        },
                    })
                    .then((res) => {
                        if (res.status === 200 && res.data.message.includes('User authenticated')) {
                            resolve(true);
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(false);
                    });
            } else {
                reject(false);
            }
        });
    }

    addUserTokenToHeader(userToken: TUser): Promise<string | boolean> {
        return new Promise((resolve, reject) => {
            if (userToken.accessToken.length > 0) {
                let headerRequest: string = 'Bearer ' + userToken.accessToken;
                resolve(headerRequest);
            } else {
                reject(false);
            }
        });
    }
}
