import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationImageAndNameComponent } from './integration-image-and-name.component';

describe('IntegrationImageAndNameComponent', () => {
  let component: IntegrationImageAndNameComponent;
  let fixture: ComponentFixture<IntegrationImageAndNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationImageAndNameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntegrationImageAndNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
