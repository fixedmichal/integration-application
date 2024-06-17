import { BudgetCategoryItem } from './../../../types/budget-category-item.type';
import { createServiceFactory } from '@ngneat/spectator/jest';
import { VersionsService } from './versions.service';
import { SpectatorService, mockProvider } from '@ngneat/spectator/jest';
import { IntegrationsClientService } from '@services/api-clients/integrations-client.service';
import { VersionsComponentsCommunicationService } from '@services/versions-components-communication/versions-components-communication.service';
import { VersionsClientService } from '@services/api-clients/versions-client.service';
import { CategoryItemsClientService } from '@services/api-clients/category-items-client.service';
import { NotificationService } from '@services/notification/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryItemsService } from '@services/category-items/category-items.service';
import { BehaviorSubject, Observable, Subject, mergeMap, of, tap } from 'rxjs';
import { ExtendedIntegration } from 'src/types/extended-integration.type';
import { Version } from 'src/types/version.type';

describe('VersionsService', () => {
  let spectator: SpectatorService<VersionsService>;
  const addedCategoryItemMock$ = new Subject<BudgetCategoryItem>();
  const removedCategoryItemMock$ = new Subject<BudgetCategoryItem>();

  let fullIntegrationMock$: Observable<ExtendedIntegration | null>;
  let allCategoryItemsMock$: Observable<BudgetCategoryItem[] | null>;
  let deleteVersionMock$: Observable<{} | null>;
  let allVersionsMock$: Observable<Version[] | null>;

  const createService = createServiceFactory({
    service: VersionsService,
    providers: [
      mockProvider(CategoryItemsService, {
        addedCategoryItem$: addedCategoryItemMock$,
        removedCategoryItem$: removedCategoryItemMock$,
      }),
      mockProvider(CategoryItemsClientService, {
        getAllCategoryItems: jest.fn(() => allCategoryItemsMock$),
      }),
      mockProvider(IntegrationsClientService, {
        getFullIntegrationById: jest.fn(() => fullIntegrationMock$),
      }),
      mockProvider(VersionsClientService, {
        deleteVersion: jest.fn(() => deleteVersionMock$),
        getAllVersions: jest.fn(() => allVersionsMock$),
        patchVersion: jest.fn(() => of({})),
      }),
    ],
    mocks: [VersionsComponentsCommunicationService, NotificationService, MatDialog],
  });

  // MOCK VALUES
  const integrationId = 7;
  const primaryVersion = { id: 8, integrationId: integrationId, name: 'Wersija 1', isFinal: true };
  const secondaryVersion = { id: 18, integrationId: integrationId, name: 'Wersija 2', isFinal: false };

  const fullIntegration: ExtendedIntegration = {
    budget: 100000,
    name: 'Integracija',
    participants: 50,
    picture: 'someUrl',
    categories: [{ integrationId: integrationId, name: 'Kategorija', id: 1 }],
    id: integrationId,
    versions: [primaryVersion, secondaryVersion],
  };

  const allCategoryItems: BudgetCategoryItem[] = [
    { id: 1, name: 'autokar', cost: 2200, perParticipant: false, versionId: primaryVersion.id, categoryId: 1 },
    {
      id: 2,
      name: 'zakwaterowanie pracowników',
      cost: 80,
      perParticipant: true,
      versionId: primaryVersion.id,
      categoryId: 1,
    },
    {
      id: 3,
      name: 'catering dla pracowników',
      cost: 220,
      perParticipant: true,
      versionId: primaryVersion.id,
      categoryId: 1,
    },
    {
      id: 21,
      name: 'traktor',
      cost: 120,
      perParticipant: false,
      versionId: 999,
      categoryId: 1,
    },
    {
      id: 22,
      name: 'ciągnik',
      cost: 210,
      perParticipant: false,
      versionId: 999,
      categoryId: 1,
    },
    {
      id: 23,
      name: 'betoniara',
      cost: 2100,
      perParticipant: false,
      versionId: 999,
      categoryId: 1,
    },
    {
      id: 11,
      name: 'autokar (60 os)',
      cost: 3000,
      perParticipant: false,
      versionId: secondaryVersion.id,
      categoryId: 1,
    },
    {
      id: 12,
      name: 'zakwaterowanie pracowników',
      cost: 100,
      perParticipant: true,
      versionId: secondaryVersion.id,
      categoryId: 1,
    },
    {
      id: 13,
      name: 'catering dla pracowników',
      cost: 100,
      perParticipant: true,
      versionId: secondaryVersion.id,
      categoryId: 1,
    },
  ];

  beforeEach(() => {
    spectator = createService();
    fullIntegrationMock$ = of(null);
    allCategoryItemsMock$ = of(null);
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('emitPrimaryIntegrationVersion should create primaryIntegrationVersion and store it in integrationPrimaryVersion$$ subject', (done) => {
    const service = spectator.service;

    // GIVEN
    const expectedIntegrationPrimaryVersion: ExtendedIntegration = {
      ...fullIntegration,
      categories: [
        {
          integrationId: 7,
          name: 'Kategorija',
          cost: 2500,
          id: 1,
          items: [
            ...allCategoryItems.filter((categoryItem) => categoryItem.versionId === 8 && categoryItem.categoryId === 1),
          ],
          isModified: false,
          isNewEntry: false,
        },
      ],
      appliedVersion: primaryVersion,
    };

    // GIVEN
    spectator.service['integrationId$$'].next(integrationId);
    allCategoryItemsMock$ = of(allCategoryItems);
    fullIntegrationMock$ = of(fullIntegration);

    // WHEN
    const testedMethod = service.emitPrimaryIntegrationVersion();

    testedMethod
      .pipe(mergeMap(() => service.integrationPrimaryVersion$))
      .subscribe((actualIntegrationPrimaryVersion) => {
        // THEN
        expect(actualIntegrationPrimaryVersion).toEqual(expectedIntegrationPrimaryVersion);
        done();
      });

    // is called once ?
  });

  it('saveIntegrationId ', (done) => {
    const service = spectator.service;

    // GIVEN
    const expectedId = 777;
    // WHEN
    service.saveIntegrationId(expectedId);
    service.integrationId$.subscribe((integrationId) => {
      // THEN
      expect(integrationId).toBe(expectedId);
      done();
    });
  });

  it('setSecondaryVersion', (done) => {
    const service = spectator.service;

    const expectedVersion: Version = { id: 8, integrationId: 7, name: 'Wersija', isFinal: true };

    service.setSecondaryVersion(expectedVersion);

    service.secondaryVersion$.subscribe((actualVersion) => {
      expect(actualVersion).toEqual(expectedVersion);
      done();
    });
  });

  it('emitSecondaryIntegrationVersion should create secondaryIntegrationVersion and store it in integrationSecondaryVersion$$ subject', (done) => {
    const service = spectator.service;

    //GIVEN
    const integrationPrimaryVersion: ExtendedIntegration = {
      ...fullIntegration,
      categories: [
        {
          integrationId: integrationId,
          name: 'Kategorija',
          cost: 3200,
          id: 1,
          items: [
            ...allCategoryItems.filter(
              (categoryItem) => categoryItem.versionId === secondaryVersion.id && categoryItem.categoryId === 1
            ),
          ],
          isModified: false,
          isNewEntry: false,
        },
      ],
      appliedVersion: primaryVersion,
    };

    //GIVEN
    service['secondaryVersion$$'].next(secondaryVersion);
    service['integrationPrimaryVersion$$'].next(integrationPrimaryVersion);
    allCategoryItemsMock$ = of(allCategoryItems);

    const expectedSecondaryIntegrationVersion: ExtendedIntegration = {
      ...integrationPrimaryVersion,
      appliedVersion: secondaryVersion,
    };

    //WHEN
    service
      .emitSecondaryIntegrationVersion()
      .pipe(mergeMap(() => service.integrationSecondaryVersion$))
      .subscribe((actualSecondaryIntegrationVersion) => {
        //THEN
        expect(actualSecondaryIntegrationVersion).toEqual(expectedSecondaryIntegrationVersion);
        done();
      });
  });

  it('deleteVersion should  ..., when there was only secondary version', (done) => {
    const service = spectator.service;

    //GIVEN
    const deletedVersionId = 333;
    deleteVersionMock$ = of({});
    allVersionsMock$ = of([primaryVersion]);
    jest.spyOn(service, 'integrationPrimaryVersion$', 'get').mockReturnValue(of(fullIntegration));

    const showSuccessToastSpy = jest.spyOn(service['notificationService'], 'showSuccess');

    //WHEN
    service
      .deleteVersion(deletedVersionId)
      .pipe(
        //THEN
        tap(() => expect(showSuccessToastSpy).toHaveBeenCalledWith('Successfully deleted version!')),
        mergeMap(() => service['secondaryVersion$$']),
        //THEN
        tap((secondaryVersion) => expect(secondaryVersion).toEqual(null)),
        mergeMap(() => service['integrationSecondaryVersion$$']),
        tap((integrationSecondaryVersion) => expect(integrationSecondaryVersion).toEqual(null))
      )
      .subscribe(() => {
        done();
      });
  });

  it('deleteVersion should  ..., when there were more than one secondary versions', (done) => {
    const service = spectator.service;

    //GIVEN
    const deletedVersionId = 333;

    deleteVersionMock$ = of({});
    allVersionsMock$ = of([primaryVersion, secondaryVersion]);
    fullIntegrationMock$ = of(fullIntegration);
    allCategoryItemsMock$ = of(allCategoryItems);

    jest.spyOn(service, 'integrationPrimaryVersion$', 'get').mockReturnValue(of(fullIntegration));

    const showSuccessToastSpy = jest.spyOn(service['notificationService'], 'showSuccess');
    //WHEN
    service
      .deleteVersion(deletedVersionId)
      .pipe(
        //THEN
        tap(() => expect(showSuccessToastSpy).toHaveBeenCalledWith('Successfully deleted version!')),
        mergeMap(() => service['secondaryVersion$$']),
        //THEN
        tap((secondaryVer) => expect(secondaryVer).toEqual(secondaryVersion))
      )
      .subscribe(() => {
        done();
      });
  });

  it('setVersionAsMain', (done) => {
    const service = spectator.service;

    //GIVEN
    const integrationSecondaryVersion: ExtendedIntegration = { ...fullIntegration, appliedVersion: primaryVersion };

    spectator.service['integrationId$$'].next(8);
    allVersionsMock$ = of([primaryVersion, secondaryVersion]);
    fullIntegrationMock$ = of(fullIntegration);
    allCategoryItemsMock$ = of(allCategoryItems);
    service['integrationSecondaryVersion$$'].next(integrationSecondaryVersion);
    service['secondaryVersion$$'].next(secondaryVersion);

    const patchVersionSpy = jest.spyOn(service['versionsClientService'], 'patchVersion');
    const showSuccessToastSpy = jest.spyOn(service['notificationService'], 'showSuccess');

    //WHEN
    service
      .setVersionAsMain()
      .pipe(
        mergeMap(() => service.integrationSecondaryVersion$),
        //THEN
        tap((actualIntegrationSecondaryVersion) => expect(actualIntegrationSecondaryVersion).toEqual(null))
      )
      .subscribe(() => {
        //THEN
        expect(patchVersionSpy).toHaveBeenCalledTimes(2);
        expect(showSuccessToastSpy).toHaveBeenCalledWith('Successfully set version as main!');

        done();
      });
  });
});
