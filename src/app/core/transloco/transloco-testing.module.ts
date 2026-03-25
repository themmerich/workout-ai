import { TranslocoTestingModule, TranslocoTestingOptions } from '@jsverse/transloco';
import de from '../../../../public/assets/i18n/de.json';

export function getTranslocoTestingModule(options: TranslocoTestingOptions = {}) {
  return TranslocoTestingModule.forRoot({
    langs: { de },
    translocoConfig: {
      availableLangs: ['de', 'en'],
      defaultLang: 'de',
    },
    ...options,
  });
}
