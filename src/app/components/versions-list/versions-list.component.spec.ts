import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionsListComponent } from './versions-list.component';

describe('VersionsListComponent', () => {
  let component: VersionsListComponent;
  let fixture: ComponentFixture<VersionsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VersionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
