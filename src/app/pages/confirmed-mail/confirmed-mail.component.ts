import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TUser } from 'src/app/types/TUser';
import { StorageService } from 'src/app/services/storage/storage.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-confirmed-mail',
    templateUrl: './confirmed-mail.component.html',
    styleUrls: ['./confirmed-mail.component.scss'],
})
export class ConfirmedMailComponent implements OnInit {
    public userId: number = 0;
    public mailCodeVerificationForm: FormGroup = new FormGroup({
        mailCodeVerification: new FormControl(
            '',
            Validators.compose([Validators.required, Validators.pattern(/(?:[A-Za-z0-9]{20})/)])
        ),
    });
    public invalidCode: boolean = false;
    private _subscription: Subscription = new Subscription();

    constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _storageService: StorageService
    ) {}

    ngOnInit(): void {
        this._subscription.add(
            this._activatedRoute.params.subscribe((observer) => {
                this.userId = observer.id;
            })
        );
    }

    confirmedMail(): void {
        const { mailCodeVerification } = this.mailCodeVerificationForm.controls;

        if (mailCodeVerification.valid) {
            this.invalidCode = false;
            this._authService
                .verifyMailCode(mailCodeVerification.value, this.userId)
                .then((res) => {
                    if (res) {
                        this.updateUserInfosFromLocalStorage('userInformations');
                        this.navigateTo('signin');
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            this.invalidCode = !mailCodeVerification.valid;
        }
    }

    async updateUserInfosFromLocalStorage(key: string): Promise<void> {
        let userInfos: TUser = JSON.parse(await this._storageService.getFromLocalStorage(key));
        userInfos.mailConfirmed = true;
        let userInfosStringified: string = JSON.stringify(userInfos);
        this._storageService.updateFromLocalStorage(key, userInfosStringified);
    }

    navigateTo(url: string): void {
        this._router.navigateByUrl(url);
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }
}
