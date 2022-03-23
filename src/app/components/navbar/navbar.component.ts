import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TUser } from 'src/app/types/TUser';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    providers: [AuthService],
})
export class NavbarComponent implements OnInit {
    constructor(private _router: Router, private _storageService: StorageService) {}

    ngOnInit(): void {}

    async signout(): Promise<void> {
        let actualUser: TUser = JSON.parse(await this._storageService.getFromLocalStorage('userInformations'));
        actualUser.isAuthenticated = false;
        let actualUserStringified: string = JSON.stringify(actualUser);
        this._storageService.updateFromLocalStorage('userInformations', actualUserStringified).then(() => {
            this.navigateTo('signin');
        });
    }

    navigateTo(url: string): void {
        this._router.navigateByUrl(url);
    }

    userIsLogged(): boolean {
        return this._storageService.userIsAuthenticated('userInformations');
    }
}
