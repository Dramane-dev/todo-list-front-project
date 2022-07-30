import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

interface Ball {
    property: string;
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    public balls: Ball[] = [
        {
            property: 'topLeft',
        },
        {
            property: 'topRight',
        },
        {
            property: 'bottomLeft',
        },
        {
            property: 'bottomRight',
        },
    ];
    public handsetScreen: boolean = false;
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

    userIsLogged(): boolean {
        return this._storageService.userIsAuthenticated('userInformations');
    }

    navigateTo(url: string): void {
        this._router.navigateByUrl(url);
    }

    ngOnDestroy(): void {
        this._subscriptions.unsubscribe();
    }
}
