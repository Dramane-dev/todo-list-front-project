import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-project-button',
  templateUrl: './new-project-button.component.html',
  styleUrls: ['./new-project-button.component.scss']
})
export class NewProjectButtonComponent implements OnInit {
  @Input() newProjectButton: boolean = false;
  @Input() projectButton: boolean = false;
  @Input() projectName: string = "";
  @Input() newTaskButton: boolean = false;
  @Input() settingsButton: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
