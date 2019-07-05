import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialProblemDetailPage } from './social-problem-detail.page';

describe('SocialProblemDetailPage', () => {
  let component: SocialProblemDetailPage;
  let fixture: ComponentFixture<SocialProblemDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialProblemDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialProblemDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
