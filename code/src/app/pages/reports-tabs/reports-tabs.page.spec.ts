import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsTabsPage } from './reports-tabs.page';

describe('ReportsTabsPage', () => {
  let component: ReportsTabsPage;
  let fixture: ComponentFixture<ReportsTabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsTabsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
