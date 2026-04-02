import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ProgressBar } from 'primeng/progressbar';
import { EarnedMedal } from '../model/medal.model';
import { ExerciseService } from '../../exercise/data-access/exercise.service';
import { MEDAL_ICON_MAP, MedalIconBoltComponent, MedalIconCalendarComponent, MedalIconFireComponent, MedalIconMuscleComponent, MedalIconRunnerComponent, MedalIconSpeedComponent, MedalIconStarComponent, MedalIconTrophyComponent, MedalIconWeightComponent } from './medal-icons';

@Component({
  selector: 'app-medal-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslocoDirective,
    ProgressBar,
    MedalIconTrophyComponent,
    MedalIconStarComponent,
    MedalIconBoltComponent,
    MedalIconFireComponent,
    MedalIconRunnerComponent,
    MedalIconSpeedComponent,
    MedalIconCalendarComponent,
    MedalIconWeightComponent,
    MedalIconMuscleComponent,
  ],
  templateUrl: './medal-card.html',
})
export class MedalCardComponent {
  private readonly transloco = inject(TranslocoService);
  private readonly exerciseService = inject(ExerciseService);

  readonly medal = input.required<EarnedMedal>();

  protected readonly iconType = computed(() => {
    const icon = this.medal().definition.icon;
    return MEDAL_ICON_MAP[icon]?.component ?? 'star';
  });

  protected readonly iconColor = computed(() => {
    const icon = this.medal().definition.icon;
    return this.medal().result.earned
      ? (MEDAL_ICON_MAP[icon]?.defaultColor ?? '#6b7280')
      : '#9ca3af';
  });

  protected readonly displayName = computed(() => {
    const m = this.medal();
    if (m.definition.id.startsWith('pr-')) {
      const exerciseId = m.definition.id.replace('pr-', '');
      const exercise = this.exerciseService.getById(exerciseId);
      return this.transloco.translate(m.definition.nameKey) + (exercise?.name ?? exerciseId);
    }
    return this.transloco.translate(m.definition.nameKey);
  });

  protected readonly displayDescription = computed(() => {
    const m = this.medal();
    if (m.definition.id.startsWith('pr-')) {
      const exerciseId = m.definition.id.replace('pr-', '');
      const exercise = this.exerciseService.getById(exerciseId);
      return this.transloco.translate(m.definition.descriptionKey, { exercise: exercise?.name ?? exerciseId });
    }
    return this.transloco.translate(m.definition.descriptionKey);
  });

  protected formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
  }
}
