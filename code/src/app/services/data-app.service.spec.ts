import { TestBed } from '@angular/core/testing';

import { DataAppService } from './data-app.service';

describe('DataAppService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataAppService = TestBed.get(DataAppService);
    expect(service).toBeTruthy();
  });
});
