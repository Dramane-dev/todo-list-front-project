import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './services/storage/storage.service';
import { TUser } from './types/TUser';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private _translate: TranslateService, private _storageService: StorageService) {
        this._translate.setDefaultLang('fr');
    }

    ngOnInit(): void {}
}
