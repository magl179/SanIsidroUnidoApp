import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicationsHomePage } from './publications-home.page';

describe('PublicationsHomePage', () => {
  let component: PublicationsHomePage;
  let fixture: ComponentFixture<PublicationsHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicationsHomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicationsHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
