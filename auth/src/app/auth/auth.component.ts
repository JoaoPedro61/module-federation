import { Component, OnInit } from '@angular/core';
import { TestingCoreEventsService } from 'testing-core-events';

@Component({
  selector: 'ng-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  constructor(private readonly coreService: TestingCoreEventsService) { }

  public ngOnInit(): void {
    this.coreService.emitEvent({
      event: 'init',
      data: {
        phase: 'ready'
      }
    });
  }

}
