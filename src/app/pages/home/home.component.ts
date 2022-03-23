import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage/storage.service';

interface Ball {
    property: string;
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
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

    constructor(private _router: Router, private _storageService: StorageService) {}

    ngOnInit(): void {}

    userIsLogged(): boolean {
        return this._storageService.userIsAuthenticated('userInformations');
    }

    navigateTo(url: string): void {
        this._router.navigateByUrl(url);
    }
}
