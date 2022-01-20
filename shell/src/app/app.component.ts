import { Component } from '@angular/core';



@Component({
  selector: 'ng-root',
  template: `
    <h1>Shell Application</h1>
    <a routerLink="/auth">Go To Auth</a>

    <router-outlet></router-outlet>
  `,
})
export class AppComponent { }
