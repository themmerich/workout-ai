import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-medal-icon-trophy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `<svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 8h24v20c0 6.627-5.373 12-12 12s-12-5.373-12-12V8z" [attr.fill]="color()" opacity="0.2"/>
    <path d="M20 8h24v20c0 6.627-5.373 12-12 12s-12-5.373-12-12V8z" [attr.stroke]="color()" stroke-width="2.5" fill="none"/>
    <path d="M20 14H12a4 4 0 0 0-4 4v2a8 8 0 0 0 8 8h4" [attr.stroke]="color()" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M44 14h8a4 4 0 0 1 4 4v2a8 8 0 0 1-8 8h-4" [attr.stroke]="color()" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M28 40h8v6H28z" [attr.fill]="color()" opacity="0.3"/>
    <path d="M24 46h16a2 2 0 0 1 2 2v4H22v-4a2 2 0 0 1 2-2z" [attr.fill]="color()" opacity="0.2"/>
    <path d="M24 46h16a2 2 0 0 1 2 2v4H22v-4a2 2 0 0 1 2-2z" [attr.stroke]="color()" stroke-width="2.5" fill="none"/>
    <circle cx="32" cy="22" r="5" [attr.fill]="color()" opacity="0.3"/>
    <text x="32" y="26" text-anchor="middle" [attr.fill]="color()" font-size="10" font-weight="bold">★</text>
  </svg>`,
})
export class MedalIconTrophyComponent {
  readonly size = input(48);
  readonly color = input('#eab308');
}

@Component({
  selector: 'app-medal-icon-star',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `<svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 6l7.5 15.2L56 23.6l-12 11.7L46.8 52 32 44.2 17.2 52 20 35.3 8 23.6l16.5-2.4z" [attr.fill]="color()" opacity="0.2"/>
    <path d="M32 6l7.5 15.2L56 23.6l-12 11.7L46.8 52 32 44.2 17.2 52 20 35.3 8 23.6l16.5-2.4z" [attr.stroke]="color()" stroke-width="2.5" stroke-linejoin="round" fill="none"/>
  </svg>`,
})
export class MedalIconStarComponent {
  readonly size = input(48);
  readonly color = input('#eab308');
}

@Component({
  selector: 'app-medal-icon-bolt',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `<svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M36 4L14 36h14L24 60 50 28H36z" [attr.fill]="color()" opacity="0.2"/>
    <path d="M36 4L14 36h14L24 60 50 28H36z" [attr.stroke]="color()" stroke-width="2.5" stroke-linejoin="round" fill="none"/>
  </svg>`,
})
export class MedalIconBoltComponent {
  readonly size = input(48);
  readonly color = input('#f59e0b');
}

@Component({
  selector: 'app-medal-icon-fire',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `<svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 4c0 0-16 14-16 32a16 16 0 0 0 32 0c0-8-4-14-8-18 0 0-2 8-8 10 0-8-4-16-4-16s0 8-4 12c-2-4 0-12 0-12S16 20 16 36" [attr.fill]="color()" opacity="0.15"/>
    <path d="M20 52a16 16 0 0 0 24 0c4-4 8-10 8-16 0-18-16-32-16-32s-4 8-4 16c-6-2-8-10-8-10s-8 10-8 18c0 6 0 12-2 16 0 0 2 4 6 8z" [attr.stroke]="color()" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M28 52c0-4 2-8 4-10 2 2 4 6 4 10" [attr.stroke]="color()" stroke-width="2" stroke-linecap="round" fill="none"/>
  </svg>`,
})
export class MedalIconFireComponent {
  readonly size = input(48);
  readonly color = input('#ef4444');
}

@Component({
  selector: 'app-medal-icon-runner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `<svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="38" cy="12" r="5" [attr.fill]="color()" opacity="0.3"/>
    <circle cx="38" cy="12" r="5" [attr.stroke]="color()" stroke-width="2.5" fill="none"/>
    <path d="M24 56l6-16 8 4 10-20-6-4-10 4-8 2-8 6" [attr.stroke]="color()" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M40 56l-4-12-8-4" [attr.stroke]="color()" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </svg>`,
})
export class MedalIconRunnerComponent {
  readonly size = input(48);
  readonly color = input('#3b82f6');
}

@Component({
  selector: 'app-medal-icon-speed',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `<svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="36" r="22" [attr.fill]="color()" opacity="0.1"/>
    <circle cx="32" cy="36" r="22" [attr.stroke]="color()" stroke-width="2.5" fill="none"/>
    <path d="M32 36l10-16" [attr.stroke]="color()" stroke-width="3" stroke-linecap="round"/>
    <circle cx="32" cy="36" r="3" [attr.fill]="color()"/>
    <path d="M20 12h8M16 18h12M12 24h10" [attr.stroke]="color()" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  </svg>`,
})
export class MedalIconSpeedComponent {
  readonly size = input(48);
  readonly color = input('#8b5cf6');
}

@Component({
  selector: 'app-medal-icon-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `<svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="14" width="48" height="42" rx="4" [attr.fill]="color()" opacity="0.1"/>
    <rect x="8" y="14" width="48" height="42" rx="4" [attr.stroke]="color()" stroke-width="2.5" fill="none"/>
    <path d="M8 26h48" [attr.stroke]="color()" stroke-width="2.5"/>
    <path d="M20 8v12M44 8v12" [attr.stroke]="color()" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M22 34l6 6 14-14" [attr.stroke]="color()" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,
})
export class MedalIconCalendarComponent {
  readonly size = input(48);
  readonly color = input('#22c55e');
}

@Component({
  selector: 'app-medal-icon-weight',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `<svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="26" y="16" width="12" height="32" rx="2" [attr.fill]="color()" opacity="0.2"/>
    <rect x="26" y="16" width="12" height="32" rx="2" [attr.stroke]="color()" stroke-width="2.5" fill="none"/>
    <rect x="18" y="22" width="8" height="20" rx="2" [attr.fill]="color()" opacity="0.15"/>
    <rect x="18" y="22" width="8" height="20" rx="2" [attr.stroke]="color()" stroke-width="2.5" fill="none"/>
    <rect x="38" y="22" width="8" height="20" rx="2" [attr.fill]="color()" opacity="0.15"/>
    <rect x="38" y="22" width="8" height="20" rx="2" [attr.stroke]="color()" stroke-width="2.5" fill="none"/>
    <rect x="10" y="26" width="8" height="12" rx="2" [attr.fill]="color()" opacity="0.1"/>
    <rect x="10" y="26" width="8" height="12" rx="2" [attr.stroke]="color()" stroke-width="2.5" fill="none"/>
    <rect x="46" y="26" width="8" height="12" rx="2" [attr.fill]="color()" opacity="0.1"/>
    <rect x="46" y="26" width="8" height="12" rx="2" [attr.stroke]="color()" stroke-width="2.5" fill="none"/>
  </svg>`,
})
export class MedalIconWeightComponent {
  readonly size = input(48);
  readonly color = input('#f97316');
}

@Component({
  selector: 'app-medal-icon-muscle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  template: `<svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 44c0 0 2-8 6-12s10-6 14-6 10 2 14 6 6 12 6 12" [attr.fill]="color()" opacity="0.15"/>
    <path d="M12 44c0 0 2-8 6-12s10-6 14-6 10 2 14 6 6 12 6 12" [attr.stroke]="color()" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M8 40c0 0 0-10 4-16s8-10 8-10" [attr.stroke]="color()" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M56 40c0 0 0-10-4-16s-8-10-8-10" [attr.stroke]="color()" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <circle cx="32" cy="20" r="3" [attr.fill]="color()"/>
  </svg>`,
})
export class MedalIconMuscleComponent {
  readonly size = input(48);
  readonly color = input('#ec4899');
}

export const MEDAL_ICON_MAP: Record<string, { component: string; defaultColor: string }> = {
  'pi-trophy': { component: 'trophy', defaultColor: '#eab308' },
  'pi-star': { component: 'star', defaultColor: '#eab308' },
  'pi-star-fill': { component: 'star', defaultColor: '#f59e0b' },
  'pi-bolt': { component: 'bolt', defaultColor: '#f59e0b' },
  'pi-clock': { component: 'runner', defaultColor: '#3b82f6' },
  'pi-forward': { component: 'speed', defaultColor: '#8b5cf6' },
  'pi-sun': { component: 'fire', defaultColor: '#ef4444' },
  'pi-calendar': { component: 'calendar', defaultColor: '#22c55e' },
  'pi-objects-column': { component: 'muscle', defaultColor: '#ec4899' },
};
