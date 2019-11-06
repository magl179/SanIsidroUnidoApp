import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialProblemsTabsPage } from './social-problems-tabs.page';

describe('SocialProblemsTabsPage', () => {
  let component: SocialProblemsTabsPage;
  let fixture: ComponentFixture<SocialProblemsTabsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialProblemsTabsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialProblemsTabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
