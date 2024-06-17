import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationEditorComponent } from './integration-editor.component';

describe('IntegrationEditorComponent', () => {
  let component: IntegrationEditorComponent;
  let fixture: ComponentFixture<IntegrationEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntegrationEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
