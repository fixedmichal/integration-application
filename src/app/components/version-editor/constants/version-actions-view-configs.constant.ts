import { VersionActionsViewConfiguration } from 'src/types/view-configuration-types/version-actions-view-config.type';

export const primaryVersionActionsViewConfiguration: VersionActionsViewConfiguration = {
  isSetAsMainButtonDisplayed: false,
  isEditButtonDisplayed: true,
  isEditNameButtonDisplayed: false,
  isDeleteButtonDisplayed: false,
};

export const secondaryVersionActionsViewConfiguration: VersionActionsViewConfiguration = {
  isSetAsMainButtonDisplayed: true,
  isEditButtonDisplayed: false,
  isEditNameButtonDisplayed: true,
  isDeleteButtonDisplayed: true,
};
