import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Ball } from 'src/app/interfaces/Ball';
import { TUser } from 'src/app/types/TUser';
import { StorageService } from 'src/app/services/storage/storage.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { NotifierService } from 'angular-notifier';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
    public balls: Ball[] = [
        {
            property: 'topLeft',
        },
        {
            property: 'topRight',
        },
    ];
    public signupForm: FormGroup = new FormGroup(
        {
            lastname: new FormControl('', Validators.required),
            firstname: new FormControl('', Validators.required),
            email: new FormControl('', Validators.email),
            password: new FormControl(
                '',
                Validators.compose([Validators.required, Validators.minLength(10), Validators.maxLength(16)])
            ),
            confirmedPassword: new FormControl('', Validators.compose([Validators.required])),
        },
        {
            validators: Validators.compose([this._confirmedPassword()]),
        }
    );
    public isNotSamePassword: boolean = false;
    public allFieldsAreRequired: boolean = false;
    public emailMustBeUnique: boolean = false;
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

    private _confirmedPassword(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            let password: string = control.get('password')?.value;
            let confirmedPassword: string = control.get('confirmedPassword')?.value;
            this.isNotSamePassword = password !== confirmedPassword;
            return password !== confirmedPassword ? { MatchPassword: false } : null;
        };
    }

    signup() {
        const { lastname, firstname, email, password, confirmedPassword } = this.signupForm.controls;

        if (this.signupForm.valid) {
            this._authService
                .signup(lastname.value, firstname.value, email.value, password.value, confirmedPassword.value)
                .then((res) => {
                    let user: TUser = res;
                    user.accessToken = '';
                    this.saveUserDatasInStorage('userInformations', user);
                    this._notificationService.notify(
                        'success',
                        'Votre compte a bien été créer ! Un email vous a été envoyé.'
                    );
                    setTimeout(() => {
                        this.navigateTo('confirmed-mail/' + user.userId);
                    }, 2500);
                })
                .catch((error) => {
                    if (error.includes('email must be unique')) {
                        this._notificationService.notify('error', 'Un compte ayant cette adresse mail existe déjà !');
                    }
                });
        } else {
            this._notificationService.notify('error', 'Tous les champs sont requis !');
        }
    }

    navigateTo(url: string): void {
        this._router.navigateByUrl(url);
    }

    saveUserDatasInStorage(key: string, user: TUser): void {
        let userStringified: string = JSON.stringify(user);
        this._storageService.saveFromLocalStorage(key, userStringified);
    }

    ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
