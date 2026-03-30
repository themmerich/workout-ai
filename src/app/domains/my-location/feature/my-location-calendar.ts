import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import deLocale from '@fullcalendar/core/locales/de';
import enLocale from '@fullcalendar/core/locales/en-gb';
import { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { Checkbox } from 'primeng/checkbox';
import { Dialog } from 'primeng/dialog';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Toast } from 'primeng/toast';
import { getHolidays } from 'feiertagejs';
import { AuthService } from '../../../core/auth/auth.service';
import { LocationService } from '../../location/data-access/location.service';
import { CalendarException, WEEKDAYS } from '../../location/model/location.model';

@Component({
  selector: 'app-my-location-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col h-full min-h-0' },
  providers: [MessageService],
  imports: [FormsModule, TranslocoDirective, FullCalendarModule, ButtonModule, Checkbox, Dialog, FloatLabel, InputText, Toast],
  templateUrl: './my-location-calendar.html',
})
export default class MyLocationCalendarComponent {
  private readonly authService = inject(AuthService);
  private readonly locationService = inject(LocationService);
  private readonly transloco = inject(TranslocoService);
  private readonly messageService = inject(MessageService);

  protected readonly dialogVisible = signal(false);
  protected readonly editingDate = signal('');
  protected readonly editingOpen = signal('06:00');
  protected readonly editingClose = signal('22:00');
  protected readonly editingClosed = signal(false);
  protected readonly editingNote = signal('');
  protected readonly isException = signal(false);

  private readonly location = computed(() => {
    const user = this.authService.currentUser();
    return user?.locationId ? this.locationService.getById(user.locationId) ?? null : null;
  });

  protected readonly calendarEvents = computed<EventInput[]>(() => {
    const loc = this.location();
    if (!loc) return [];

    const events: EventInput[] = [];
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 1);
    const end = new Date(today.getFullYear(), 11, 31);

    const exceptionMap = new Map<string, CalendarException>();
    loc.calendarExceptions.forEach((ex) => exceptionMap.set(ex.date, ex));

    // Feiertage laden
    const holidayMap = new Map<string, string>();
    if (loc.bundesland) {
      const lang = this.transloco.getActiveLang();
      const yearsToCheck = new Set<number>();
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        yearsToCheck.add(d.getFullYear());
      }
      yearsToCheck.forEach((year) => {
        try {
          const holidays = getHolidays(year, loc.bundesland as Parameters<typeof getHolidays>[1]);
          holidays.forEach((h) => {
            const name = lang === 'de' ? h.translate('de') : h.translate('en');
            holidayMap.set(h.dateString, name);
          });
        } catch {
          // Bundesland not supported
        }
      });
    }

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = this.toDateString(d);
      const exception = exceptionMap.get(dateStr);
      const dayIndex = (d.getDay() + 6) % 7;
      const weekday = WEEKDAYS[dayIndex];
      const regular = loc.openingHours.find((h) => h.day === weekday);

      if (exception) {
        if (exception.closed) {
          events.push({
            title: exception.note || this.transloco.translate('myLocation.calendar.closed'),
            start: dateStr,
            allDay: true,
            backgroundColor: '#ef4444',
            borderColor: '#ef4444',
            extendedProps: { type: 'exception', date: dateStr },
          });
        } else if (exception.open && exception.close) {
          events.push({
            title: exception.note || `${exception.open} - ${exception.close}`,
            start: `${dateStr}T${exception.open}`,
            end: `${dateStr}T${exception.close}`,
            backgroundColor: '#f97316',
            borderColor: '#f97316',
            extendedProps: { type: 'exception', date: dateStr },
          });
        }
      } else if (regular && !regular.closed) {
        events.push({
          title: `${regular.open} - ${regular.close}`,
          start: `${dateStr}T${regular.open}`,
          end: `${dateStr}T${regular.close}`,
          backgroundColor: '#22c55e',
          borderColor: '#22c55e',
          extendedProps: { type: 'regular', date: dateStr },
        });
      } else {
        events.push({
          title: this.transloco.translate('myLocation.calendar.closed'),
          start: dateStr,
          allDay: true,
          backgroundColor: '#6b7280',
          borderColor: '#6b7280',
          extendedProps: { type: 'regular-closed', date: dateStr },
        });
      }

      // Feiertag als zusätzliches Event
      const holidayName = holidayMap.get(dateStr);
      if (holidayName) {
        events.push({
          title: `🎉 ${holidayName}`,
          start: dateStr,
          allDay: true,
          backgroundColor: '#8b5cf6',
          borderColor: '#8b5cf6',
          extendedProps: { type: 'holiday', date: dateStr },
          display: 'block',
        });
      }
    }
    return events;
  });

  protected readonly calendarOptions = computed<CalendarOptions>(() => ({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    },
    locales: [deLocale, enLocale],
    locale: this.transloco.getActiveLang(),
    firstDay: 1,
    events: this.calendarEvents(),
    dateClick: (info: DateClickArg) => this.onDateClick(info),
    eventClick: (info: EventClickArg) => this.onEventClick(info),
    height: '100%',
    editable: false,
    selectable: true,
    buttonText: this.transloco.getActiveLang() === 'de'
      ? { today: 'Heute', month: 'Monat', week: 'Woche' }
      : { today: 'Today', month: 'Month', week: 'Week' },
  }));

  protected onDateClick(info: DateClickArg): void {
    const dateStr = info.dateStr.substring(0, 10);
    const loc = this.location();
    if (!loc) return;

    const exception = loc.calendarExceptions.find((ex) => ex.date === dateStr);
    if (exception) {
      this.editingOpen.set(exception.open ?? '06:00');
      this.editingClose.set(exception.close ?? '22:00');
      this.editingClosed.set(exception.closed);
      this.editingNote.set(exception.note);
      this.isException.set(true);
    } else {
      const d = new Date(dateStr);
      const dayIndex = (d.getDay() + 6) % 7;
      const weekday = WEEKDAYS[dayIndex];
      const regular = loc.openingHours.find((h) => h.day === weekday);
      this.editingOpen.set(regular?.open ?? '06:00');
      this.editingClose.set(regular?.close ?? '22:00');
      this.editingClosed.set(regular?.closed ?? false);
      this.editingNote.set('');
      this.isException.set(false);
    }
    this.editingDate.set(dateStr);
    this.dialogVisible.set(true);
  }

  protected onEventClick(info: EventClickArg): void {
    const dateStr = info.event.extendedProps['date'] as string;
    if (dateStr) {
      this.onDateClick({ dateStr } as DateClickArg);
    }
  }

  protected onSaveException(): void {
    const loc = this.location();
    if (!loc) return;

    const dateStr = this.editingDate();
    const exception: CalendarException = {
      date: dateStr,
      open: this.editingClosed() ? null : this.editingOpen(),
      close: this.editingClosed() ? null : this.editingClose(),
      closed: this.editingClosed(),
      note: this.editingNote(),
    };

    const exceptions = loc.calendarExceptions.filter((ex) => ex.date !== dateStr);
    exceptions.push(exception);
    this.locationService.update({ ...loc, calendarExceptions: exceptions });

    this.dialogVisible.set(false);
    this.messageService.add({
      severity: 'success',
      summary: this.transloco.translate('myLocation.calendar.saveSuccess'),
      life: 3000,
    });
  }

  protected onRemoveException(): void {
    const loc = this.location();
    if (!loc) return;

    const dateStr = this.editingDate();
    const exceptions = loc.calendarExceptions.filter((ex) => ex.date !== dateStr);
    this.locationService.update({ ...loc, calendarExceptions: exceptions });

    this.dialogVisible.set(false);
    this.messageService.add({
      severity: 'success',
      summary: this.transloco.translate('myLocation.calendar.removeSuccess'),
      life: 3000,
    });
  }

  private toDateString(d: Date): string {
    return d.toISOString().substring(0, 10);
  }
}
