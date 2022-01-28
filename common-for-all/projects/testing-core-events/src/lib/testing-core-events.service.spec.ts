import { TestBed } from '@angular/core/testing';

import { TestingCoreEventsService } from './testing-core-events.service';

describe('TestingCoreEventsService', () => {
  let service: TestingCoreEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestingCoreEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
