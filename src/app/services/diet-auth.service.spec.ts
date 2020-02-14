import { TestBed } from '@angular/core/testing';

import { DietAuthService } from './diet-auth.service';

describe('DietAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DietAuthService = TestBed.get(DietAuthService);
    expect(service).toBeTruthy();
  });
});
