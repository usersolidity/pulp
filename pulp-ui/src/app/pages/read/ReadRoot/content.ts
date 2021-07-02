/**
 * This file is only need if you want to extract messages into JSON files in locales folder
 * AND if you are also using the object syntax instead of string syntax. \
 * Check the documentation section i18n for details
 */

import en from 'locales/en/translation.json';
import { translations } from 'locales/translations';
import { _t } from 'utils/messages';

export const content = {
  signIn: () =>
    _t(
      translations.login.signIn,
      en.login.signIn // default to english if translation not found
    ),
};
