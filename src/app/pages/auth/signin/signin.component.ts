import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
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
  
  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(url: string): void {
    this._router.navigateByUrl(url);
  }
}
