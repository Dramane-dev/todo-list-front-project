import { Component, OnInit } from '@angular/core';

interface Ball {
  property: string
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  public balls: Ball[] = [
    {
      property: "topLeft"
    },
    {
      property: "topRight" 
    }
  ];
  
  constructor() { }

  ngOnInit(): void {
  }

}
