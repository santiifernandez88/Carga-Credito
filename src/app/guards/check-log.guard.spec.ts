import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { checkLogGuard } from './check-log.guard';

describe('checkLogGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => checkLogGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
