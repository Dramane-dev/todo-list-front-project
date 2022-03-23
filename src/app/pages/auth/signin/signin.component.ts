import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TUserCredential } from 'src/app/types/TUserCredential';
import { TUser } from 'src/app/types/TUser';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
interface Ball {
    property: string;
}

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
    public balls: Ball[] = [
        {
            property: 'topLeft',
        },
        {
            property: 'topRight',
        },
    ];
    public signinForm: FormGroup = new FormGroup({
        email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
        password: new FormControl(
            '',
            Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(16)])
        ),
    });
    public isInvalidInformation: boolean = false;

    constructor(private _router: Router, private _authService: AuthService, private _storageService: StorageService) {}

    ngOnInit(): void {}

    signin(): void {
        if (this.signinForm.valid) {
            const { email, password } = this.signinForm.value;

            let userCredentials: TUserCredential = {
                email: email,
                password: password,
            };

            this._authService
                .signin(userCredentials)
                .then(async (res) => {
                    const { accessToken, isAuthenticated } = res.user;
                    let actualUser: TUser = JSON.parse(
                        await this._storageService.getFromLocalStorage('userInformations')
                    );
                    actualUser.accessToken = accessToken;
                    actualUser.isAuthenticated = isAuthenticated;
                    let actualUserStringified: string = JSON.stringify(actualUser);
                    this._storageService
                        .updateFromLocalStorage('userInformations', actualUserStringified)
                        .then((res) => {
                            this.navigateTo('dashboard');
                        });
                })
                .catch((error) => {
                    this.isInvalidInformation = true;
                });
        } else {
            this.isInvalidInformation = true;
        }
    }

    navigateTo(url: string): void {
        this._router.navigateByUrl(url);
    }
}
