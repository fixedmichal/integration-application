import { VersionActionsComponent } from './version-actions.component';
import { VersionsComponentsCommunicationService } from '@services/versions-components-communication/versions-components-communication.service';
import { Subject } from 'rxjs';
import { VersionActionsViewConfiguration } from 'src/types/view-configuration-types/version-actions-view-config.type';
import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator/jest';

describe('VersionActionsComponent', () => {
  let spectator: Spectator<VersionActionsComponent>;

  const componentViewConfiguration: VersionActionsViewConfiguration = {
    isSetAsMainButtonDisplayed: true,
    isEditButtonDisplayed: true,
    isEditNameButtonDisplayed: true,
    isDeleteButtonDisplayed: true,
  };

  let mockVersionId = 999;
  const versionDuplicationNotInProgressMock$ = new Subject<number>();

  const createComponent = createComponentFactory({
    detectChanges: false,
    component: VersionActionsComponent,
    providers: [
      mockProvider(VersionsComponentsCommunicationService, {
        versionDuplicationNotInProgress$: versionDuplicationNotInProgressMock$.asObservable(),
      }),
    ],
  });

  beforeEach(async () => {
    spectator = createComponent();
    // spectator.component.viewConfig = componentViewConfiguration;
    // spectator.detectChanges();
  });

  it('should create', () => {
    spectator.component.viewConfig = componentViewConfiguration;
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it('should display "setAsMain" button if it is configured to be displayed', () => {
    spectator.component.viewConfig = { ...componentViewConfiguration, isSetAsMainButtonDisplayed: true };
    spectator.detectChanges();
    const button = spectator.query('[data-test-id="setAsMain-button"]');

    expect(button).toBeTruthy();
  });

  it('should NOT display "setAsMain" button if it is configured to be NOT displayed', () => {
    spectator.component.viewConfig = { ...componentViewConfiguration, isSetAsMainButtonDisplayed: false };
    spectator.detectChanges();
    const button = spectator.query('[data-test-id="setAsMain-button"]');

    expect(button).toBeFalsy();
  });

  it('should display "delete" button if it is configured to be displayed', () => {
    spectator.component.viewConfig = { ...componentViewConfiguration, isDeleteButtonDisplayed: true };
    spectator.detectChanges();
    const button = spectator.query('[data-test-id="delete-button"]');

    expect(button).toBeTruthy();
  });

  it('should NOT display "delete" button if it is configured to be NOT displayed', () => {
    spectator.component.viewConfig = { ...componentViewConfiguration, isDeleteButtonDisplayed: false };
    spectator.detectChanges();
    console.log(spectator.component.viewConfig);
    const button = spectator.query('[data-test-id="delete-button"]');

    expect(button).toBeFalsy();
  });

  it('should show spinner in "duplicate" button and disable button after button is clicked and hide it when observable with correct versionId from service comes', () => {
    spectator.component.viewConfig = componentViewConfiguration;
    spectator.detectChanges();

    spectator.component.versionId = mockVersionId;
    const button = spectator.query('[data-test-id="duplicate-version-button"]') as HTMLButtonElement;
    const spinner = () => spectator.query('[data-test-id="duplicate-version-button-spinner"]');
    console.log(spectator.component.viewConfig);
    button.click();
    spectator.detectChanges();

    expect(button.disabled).toBeTruthy();
    expect(spinner()).toBeTruthy();
    versionDuplicationNotInProgressMock$.next(mockVersionId);
    spectator.detectChanges();

    expect(spinner()).toBeFalsy();
  });
});
