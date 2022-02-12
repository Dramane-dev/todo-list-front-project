import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {
  @Input() taskName: string = "";
  @Input() taskDescription: string = "";
  @Input() taskCreatedAt: string = "";
  @Input() taskStatus: string = "";

  constructor() { }

  ngOnInit(): void {
  }

  deleteTask() {
    console.log('Implement the delete Task function');
  }
}
