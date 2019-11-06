import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergenciesTabsPage } from './emergencies-tabs.page';

describe('EmergenciesTabsPage', () => {
  let component: EmergenciesTabsPage;
  let fixture: ComponentFixture<EmergenciesTabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergenciesTabsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergenciesTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
