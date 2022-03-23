import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
    @Input() taskName: string = '';
    @Input() taskDescription: string = '';
    @Input() taskCreatedAt: string = '';
    @Input() taskStatus: string = '';
    @Output() isDeletedButton: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() isUpdatedButton: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {}

    ngOnInit(): void {
        console.log(this.taskDescription);
    }

    updateTask() {
        this.isUpdatedButton.emit(true);
    }

    deleteTask(isDelete: boolean) {
        console.log('Implement the delete Task function');
        this.isDeletedButton.emit(isDelete);
    }
}
