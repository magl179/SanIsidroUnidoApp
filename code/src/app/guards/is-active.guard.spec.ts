import { TestBed, async, inject } from '@angular/core/testing';

import { IsActiveGuard } from './is-active.guard';

describe('IsActiveGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsActiveGuard]
    });
  });

  it('should ...', inject([IsActiveGuard], (guard: IsActiveGuard) => {
    expect(guard).toBeTruthy();
  }));
});
