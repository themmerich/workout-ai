import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { SelectButton } from 'primeng/selectbutton';
import { MedalService } from '../data-access/medal.service';
import { MedalCategory } from '../model/medal.model';
import { MedalCardComponent } from '../ui/medal-card';

@Component({
  selector: 'app-medal-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  imports: [FormsModule, TranslocoDirective, SelectButton, MedalCardComponent],
  templateUrl: './medal-page.html',
})
export default class MedalPageComponent {
  private readonly medalService = inject(MedalService);
  private readonly transloco = inject(TranslocoService);

  protected readonly activeCategory = signal<MedalCategory | 'all'>('all');

  protected readonly categoryOptions = computed(() => [
    { label: this.transloco.translate('medal.categories.all'), value: 'all' },
    { label: this.transloco.translate('medal.categories.strength'), value: 'strength' },
    { label: this.transloco.translate('medal.categories.cardio'), value: 'cardio' },
    { label: this.transloco.translate('medal.categories.general'), value: 'general' },
  ]);

  protected readonly filteredMedals = computed(() => {
    const cat = this.activeCategory();
    const all = this.medalService.medals();
    if (cat === 'all') return all;
    return all.filter((m) => m.definition.category === cat);
  });

  protected readonly earnedCount = this.medalService.earnedCount;
  protected readonly totalCount = this.medalService.totalCount;
}
