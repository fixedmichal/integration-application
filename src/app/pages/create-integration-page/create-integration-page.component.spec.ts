import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIntegrationPageComponent } from './create-integration-page.component';

describe('CreateIntegrationPageComponent', () => {
  let component: CreateIntegrationPageComponent;
  let fixture: ComponentFixture<CreateIntegrationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIntegrationPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateIntegrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
