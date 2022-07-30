import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TUserCredential } from 'src/app/types/TUserCredential';
import { TUser } from 'src/app/types/TUser';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { NotifierService } from 'angular-notifier';

interface Ball {
    property: string;
}

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit, OnDestroy {
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
    public handsetScreen: boolean = false;
    private _subscriptions: Subscription = new Subscription();

    constructor(
        private _router: Router,
        private _authService: AuthService,
        private _storageService: StorageService,
        private _responsive: BreakpointObserver,
        private _notificationService: NotifierService
    ) {}

    ngOnInit(): void {
        this._subscriptions.add(
            this._responsive.observe(Breakpoints.HandsetPortrait).subscribe((result) => {
                if (result.matches) {
                    this.handsetScreen = true;
                }
            })
        );
    }

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
                    this._storageService.updateFromLocalStorage('userInformations', actualUserStringified).then(() => {
                        this._notificationService.notify('success', res.message);
                        setTimeout(() => {
                            this.navigateTo('dashboard');
                        }, 2500);
                    });
                })
                .catch((error) => {
                    this._notificationService.notify('error', error);
                });
        } else {
            this._notificationService.notify('error', 'Email ou mot de passe incorrect');
        }
    }

    navigateTo(url: string): void {
        this._router.navigateByUrl(url);
    }

    ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
