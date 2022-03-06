import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Ball } from 'src/app/interfaces/Ball';
import { User } from 'src/app/interfaces/User';
import { TUser } from 'src/app/types/TUser';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
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

    private _storage: Storage = window.localStorage;

    constructor(private _router: Router, private _authService: AuthService, private _storageService: StorageService) {}

    ngOnInit(): void {}

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
                    this.saveUserDatasInStorage('userInformations', user);
                    this.navigateTo('confirmed-mail/' + user.userId);
                })
                .catch((error) => {
                    if (error.includes('email must be unique')) {
                        this.emailMustBeUnique = true;
                    }
                    console.log(error);
                });
        } else {
            this.allFieldsAreRequired = true;
        }
    }

    navigateTo(url: string): void {
        this._router.navigateByUrl(url);
    }

    saveUserDatasInStorage(key: string, user: TUser): void {
        let userStringified: string = JSON.stringify(user);
        this._storageService.saveFromLocalStorage(key, userStringified);
    }
}
