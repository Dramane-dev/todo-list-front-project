import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public todos: string[] = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  public doing: string[] = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  public done: string[] = ['Get up up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  public projects: string[] = ['Get up up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  public projectName: string = "Développement de l'appli todo list";
  
  constructor() { }

  ngOnInit(): void {
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  changeProjectTitle(projectName: string) {
    console.log(projectName);
    this.projectName = projectName;
  }
}
