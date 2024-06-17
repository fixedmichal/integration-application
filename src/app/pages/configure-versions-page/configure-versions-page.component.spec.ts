import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureVersionsPageComponent } from './configure-versions-page.component';

describe('ConfigureVersionsPageComponent', () => {
  let component: ConfigureVersionsPageComponent;
  let fixture: ComponentFixture<ConfigureVersionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigureVersionsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfigureVersionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
