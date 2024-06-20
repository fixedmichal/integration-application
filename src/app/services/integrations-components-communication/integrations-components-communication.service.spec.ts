import { TestBed } from '@angular/core/testing';

import { IntegrationsComponentsCommunicationService } from './integrations-components-communication.service';

describe('ComponentsCommunicationService', () => {
  let service: IntegrationsComponentsCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegrationsComponentsCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
