import { TestBed } from '@angular/core/testing';

import { BannedService } from './banned.service';

describe('BannedService', () => {
  let service: BannedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BannedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
