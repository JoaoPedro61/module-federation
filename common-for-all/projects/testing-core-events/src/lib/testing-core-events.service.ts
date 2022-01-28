import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestingCoreEventsService {

  private eventStream$$ = new Subject();

  eventStream$ = this.eventStream$$.asObservable();

  constructor() { }

  public emitEvent(event: any): void {
    this.eventStream$$.next(event);
  }
}
