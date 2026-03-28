import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LocationLogo } from '../model/location.model';

@Component({
  selector: 'app-location-logo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './location-logo.html',
})
export class LocationLogoComponent {
  readonly logo = input<LocationLogo | null>(null);
  readonly name = input('');
  readonly size = input(36);

  protected readonly initials = computed(() => {
    const n = this.name();
    if (!n) return '';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.substring(0, 2).toUpperCase();
  });
}
