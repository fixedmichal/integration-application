import { TestBed } from '@angular/core/testing';

import { VersionsComponentsCommunicationService } from './versions-components-communication.service';

describe('VersionsComponentsCommunicationService', () => {
  let service: VersionsComponentsCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionsComponentsCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
