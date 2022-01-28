import { Component } from '@angular/core';
import { TestingCoreEventsService } from 'testing-core-events';

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

  constructor(
    public readonly appService: AppService,
    public readonly coreService: TestingCoreEventsService
  ) {
    this.coreService.eventStream$.subscribe((event) => {
      console.log('Event received in shell', event);
    })
  }

}
