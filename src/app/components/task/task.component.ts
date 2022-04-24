import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
    @Input() taskId: number = 0;
    @Input() taskName: string = '';
    @Input() taskDescription: string = '';
    @Input() taskCreatedAt: string = '';
    @Input() taskStatus: string = '';
    @Input() projectId: number = 0;
    @Output() isDeletedButton: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() isUpdatedButton: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {}

    ngOnInit(): void {}

    updateTask() {
        this.isUpdatedButton.emit(true);
    }

    deleteTask(isDelete: boolean) {
        this.isDeletedButton.emit(isDelete);
    }
}
