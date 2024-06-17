import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationPageFooterComponent } from './integration-page-footer.component';

describe('IntegrationPageFooterComponent', () => {
  let component: IntegrationPageFooterComponent;
  let fixture: ComponentFixture<IntegrationPageFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationPageFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntegrationPageFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
