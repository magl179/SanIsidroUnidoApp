import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialProblemsPage } from './social-problems.page';

describe('SocialProblemsPage', () => {
  let component: SocialProblemsPage;
  let fixture: ComponentFixture<SocialProblemsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialProblemsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialProblemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
