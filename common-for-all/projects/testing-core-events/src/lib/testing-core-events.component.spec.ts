import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingCoreEventsComponent } from './testing-core-events.component';

describe('TestingCoreEventsComponent', () => {
  let component: TestingCoreEventsComponent;
  let fixture: ComponentFixture<TestingCoreEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestingCoreEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingCoreEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
