import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialProblemCreatePage } from './social-problem-create.page';

describe('SocialProblemCreatePage', () => {
  let component: SocialProblemCreatePage;
  let fixture: ComponentFixture<SocialProblemCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialProblemCreatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialProblemCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
