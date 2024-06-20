import { TestBed } from '@angular/core/testing';

import { IntegrationsClientService } from './integrations-client.service';

describe('IntegrationsClientService', () => {
  let service: IntegrationsClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegrationsClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
