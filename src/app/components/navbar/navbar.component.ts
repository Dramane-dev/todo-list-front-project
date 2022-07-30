import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TUser } from 'src/app/types/TUser';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    providers: [AuthService],
})
export class NavbarComponent implements OnInit, OnDestroy {
    public handsetScreen: boolean = false;
    public menuIsShow: boolean = false;
    private _subscriptions: Subscription = new Subscription();

    constructor(
        private _router: Router,
        private _storageService: StorageService,
        private _responsive: BreakpointObserver
    ) {}

    ngOnInit(): void {
        this._subscriptions.add(
            this._responsive.observe(Breakpoints.HandsetPortrait).subscribe((result) => {
                if (result.matches) {
                    this.handsetScreen = true;
                } else {
                    this.handsetScreen = false;
                }
            })
        );
    }

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
        this.menuIsShow = false;
    }

    userIsLogged(): boolean {
        return this._storageService.userIsAuthenticated('userInformations');
    }

    showMenu(): boolean {
        return (this.menuIsShow = true);
    }

    hideMenu(): boolean {
        return (this.menuIsShow = false);
    }

    ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
