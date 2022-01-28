import { Component } from '@angular/core';

import { AppService } from './app.service';

@Component({
  selector: 'ng-root',
  template: `
    <h1>Shell Application</h1>
    <p *ngFor="let micro of appService.microFrontendList">
      <a routerLink="/{{$any(micro).pathName}}">Go To {{$any(micro).exposedNgModule}}#{{$any(micro).name}}</a>
    </p>

    <router-outlet></router-outlet>
  `,
})
export class AppComponent {

  constructor(public readonly appService: AppService) { }

}
