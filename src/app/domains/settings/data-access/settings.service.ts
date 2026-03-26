import { inject, Injectable, signal } from '@angular/core';
import { LocalStorageService } from '../../../shared';
import { AppSettings } from '../model';
import { MOCK_SETTINGS } from './settings.mock';

const STORAGE_KEY = 'workout-ai-settings';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly storage = inject(LocalStorageService);
  readonly settings = signal<AppSettings>(this.load());

  save(settings: AppSettings): void {
    this.settings.set(settings);
    this.storage.set(STORAGE_KEY, settings);
  }

  private load(): AppSettings {
    return this.storage.get<AppSettings>(STORAGE_KEY) ?? MOCK_SETTINGS;
  }
}
