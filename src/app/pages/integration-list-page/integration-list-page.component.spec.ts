import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationListPageComponent } from './integration-list-page.component';

describe('IntegrationListPageComponent', () => {
  let component: IntegrationListPageComponent;
  let fixture: ComponentFixture<IntegrationListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationListPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntegrationListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
