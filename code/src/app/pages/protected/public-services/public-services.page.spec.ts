import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicServicesPage } from './public-services.page';

describe('PublicServicesPage', () => {
  let component: PublicServicesPage;
  let fixture: ComponentFixture<PublicServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicServicesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
