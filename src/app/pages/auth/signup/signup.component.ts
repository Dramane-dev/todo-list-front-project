import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

interface Ball {
  property: string
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
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
