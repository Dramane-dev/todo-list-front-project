import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TUser } from 'src/app/types/TUser';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
    constructor(private _router: Router, private _storageService: StorageService) {}
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        let actualUser: TUser = JSON.parse(await this._storageService.getFromLocalStorage('userInformations'));

        if (!actualUser || !actualUser.isAuthenticated) {
            this._router.navigateByUrl('signin');
            return false;
        }

        return true;
    }
}
