import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Ball {
  property: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public balls: Ball[] = [
    {
      property: "topLeft"
    },
    {
      property: "topRight" 
    },
    {
      property: "bottomLeft" 
    },
    {
      property: "bottomRight" 
    }
  ];

  constructor(private _router: Router) { }
  
  ngOnInit(): void {
  }

  navigateTo(url: string): void {
    this._router.navigateByUrl(url);
  }
}
