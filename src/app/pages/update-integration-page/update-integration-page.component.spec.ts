import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateIntegrationPageComponent } from './update-integration-page.component';

describe('UpdateIntegrationPageComponent', () => {
  let component: UpdateIntegrationPageComponent;
  let fixture: ComponentFixture<UpdateIntegrationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateIntegrationPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateIntegrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
