import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationTileComponent } from './integration-tile.component';

describe('IntegrationTileComponent', () => {
  let component: IntegrationTileComponent;
  let fixture: ComponentFixture<IntegrationTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationTileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IntegrationTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
