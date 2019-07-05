import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectoryInfoPage } from './directory-info.page';

describe('DirectoryInfoPage', () => {
  let component: DirectoryInfoPage;
  let fixture: ComponentFixture<DirectoryInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectoryInfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectoryInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
