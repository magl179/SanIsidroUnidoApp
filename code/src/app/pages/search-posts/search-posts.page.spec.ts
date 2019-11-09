import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPostsPage } from './search-posts.page';

describe('SearchPostsPage', () => {
  let component: SearchPostsPage;
  let fixture: ComponentFixture<SearchPostsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPostsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPostsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
