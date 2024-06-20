import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionEditorComponent } from './version-editor.component';

describe('VersionEditorComponent', () => {
  let component: VersionEditorComponent;
  let fixture: ComponentFixture<VersionEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VersionEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
