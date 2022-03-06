import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    public fileUrl: string = '../../../assets/images/user-image.png';

    private _storage: Storage = window.localStorage;

    constructor() {}

    ngOnInit(): void {
        let userHaveAnImage: boolean = this.checkUserImage();
        if (userHaveAnImage) {
            this.fileUrl = this.getUserImageFromStorage();
        }
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];

        if (file) {
            let reader: FileReader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e: any) => {
                let { result } = e.target;
                this.fileUrl = result;
                this.saveUserImageToLocalStorage(result);
            };
        }
    }

    saveUserImageToLocalStorage(imgPath: string): void {
        this._storage.setItem('user-profile-image', imgPath);
    }

    checkUserImage(): boolean {
        return this._storage.getItem('user-profile-image') !== null;
    }

    getUserImageFromStorage(): string {
        return this._storage.getItem('user-profile-image') as string;
    }

    deleteUserImageFromStorage(): void {
        this._storage.removeItem('user-profile-image');
        this.resetUserImage();
    }

    resetUserImage(): void {
        this.fileUrl = '../../../assets/images/user-image.png';
    }
}
