import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Select } from 'primeng/select';
import { LocalStorageService } from '../../shared/utils/local-storage.service';
import { LocationService } from '../../domains/location/data-access/location.service';
import { UserService } from '../../domains/user/data-access/user.service';
import { AuthService } from '../auth/auth.service';

const LAST_LOCATION_KEY = 'workout-ai-last-location';

@Component({
  selector: 'app-login-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoDirective,
    ButtonModule,
    FloatLabel,
    InputText,
    Message,
    Select,
  ],
  templateUrl: './login-page.html',
})
export default class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly locationService = inject(LocationService);
  private readonly storage = inject(LocalStorageService);
  private readonly router = inject(Router);

  protected readonly errorKey = signal<string | null>(null);
  protected readonly isAdminUser = signal(false);

  protected readonly locationOptions = computed(() =>
    this.locationService.locations().map((l) => ({
      label: l.name,
      value: l.id,
    })),
  );

  protected readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    locationId: [this.storage.get<string>(LAST_LOCATION_KEY) ?? ''],
  });

  protected onUsernameChange(username: string): void {
    const user = this.userService.getAll().find((u) => u.username === username);
    this.isAdminUser.set(user?.role === 'admin');
    this.errorKey.set(null);
  }

  protected onLocationChange(locationId: string | null): void {
    if (locationId) {
      this.storage.set(LAST_LOCATION_KEY, locationId);
    } else {
      this.storage.remove(LAST_LOCATION_KEY);
    }
    this.errorKey.set(null);
  }

  protected onLogin(): void {
    if (this.form.invalid) return;

    const { username, password, locationId } = this.form.getRawValue();
    const error = this.authService.login(
      username,
      password,
      this.isAdminUser() ? null : locationId || null,
    );

    if (error) {
      this.errorKey.set(error);
    } else {
      this.router.navigate(['/']);
    }
  }
}
