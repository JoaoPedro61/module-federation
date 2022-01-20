import { Component } from '@angular/core';

import { AppService } from './app.service';

@Component({
  selector: 'ng-root',
  template: `
    <h1>Shell Application</h1>
    <p *ngFor="let micro of appService.microfrontends">
      <a routerLink="/{{micro.pathName}}">Go To {{micro.name}}</a>
    </p>

    <router-outlet></router-outlet>
  `,
})
export class AppComponent {

  constructor(public readonly appService: AppService) { }

}
