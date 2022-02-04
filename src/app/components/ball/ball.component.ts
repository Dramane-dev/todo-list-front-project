import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss']
})
export class BallComponent implements OnInit {
  @Input() topLeft: boolean = false;
  @Input() bottomLeft: boolean = false;
  @Input() topRight: boolean = false;
  @Input() bottomRight: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
