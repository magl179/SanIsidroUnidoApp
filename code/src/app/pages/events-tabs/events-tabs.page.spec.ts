import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsTabsPage } from './events-tabs.page';

describe('EventsTabsPage', () => {
  let component: EventsTabsPage;
  let fixture: ComponentFixture<EventsTabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventsTabsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
