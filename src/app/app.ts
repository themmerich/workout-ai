import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/layout';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header />
    <main class="p-6">
      <router-outlet />
    </main>
  `,
})
export class App {}
