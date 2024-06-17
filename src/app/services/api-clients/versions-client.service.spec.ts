import { TestBed } from '@angular/core/testing';

import { VersionsClientService } from './versions-client.service';

describe('VersionsClientService', () => {
  let service: VersionsClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionsClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
