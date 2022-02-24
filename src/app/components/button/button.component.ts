import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
    @Input() newProjectButton: boolean = false;
    @Input() projectButton: boolean = false;
    @Input() projectName: string = '';
    @Input() newTaskButton: boolean = false;
    @Input() settingsButton: boolean = false;
    @Input() simpleButton: boolean = false;

    constructor() {}

    ngOnInit(): void {}
}
