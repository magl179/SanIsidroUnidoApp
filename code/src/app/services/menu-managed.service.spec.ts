import { TestBed } from '@angular/core/testing';

import { MenuManagedService } from './menu-managed.service';

describe('MenuManagedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MenuManagedService = TestBed.get(MenuManagedService);
    expect(service).toBeTruthy();
  });
});
