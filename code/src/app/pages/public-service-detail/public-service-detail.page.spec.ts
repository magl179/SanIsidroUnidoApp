import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicServiceDetailPage } from './public-service-detail.page';

describe('PublicServiceDetailPage', () => {
  let component: PublicServiceDetailPage;
  let fixture: ComponentFixture<PublicServiceDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicServiceDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicServiceDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
