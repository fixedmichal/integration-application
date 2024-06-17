import { TestBed } from '@angular/core/testing';

import { IntegrationFormsService } from './integration-forms.service';

describe('IntegrationFormsService', () => {
  let service: IntegrationFormsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegrationFormsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
