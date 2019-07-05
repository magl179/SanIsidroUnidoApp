import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmergencyCreatePage } from './emergency-create.page';

describe('EmergencyCreatePage', () => {
  let component: EmergencyCreatePage;
  let fixture: ComponentFixture<EmergencyCreatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergencyCreatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmergencyCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
