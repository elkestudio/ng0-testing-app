import {
  Component,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
  forwardRef,
  inject,
  OnDestroy,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { Ng0IconComponent } from '../icon/icon.component';
import { PopoverService, PopoverRef } from '../../services/popover/popover.service';

@Component({
  selector: 'ng0-date-picker',
  standalone: true,
  imports: [FormsModule, Ng0IconComponent],
  templateUrl: './date-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ng0DatePickerComponent),
      multi: true,
    },
  ],
})
export class Ng0DatePickerComponent implements ControlValueAccessor, OnDestroy {
  readonly placeholder = input<string>('Select date');
  readonly disabled = input<boolean>(false);
  readonly minDate = input<Date>();
  readonly maxDate = input<Date>();

  readonly dateChangeEvent = output<Date | null>();

  readonly isOpen = signal(false);
  readonly selectedDate = signal<Date | null>(null);
  readonly currentMonth = signal(new Date());

  private _onChange: (value: Date | null) => void = () => {};
  private _onTouched: () => void = () => {};
  private _disabled = false;

  private readonly popoverService = inject(PopoverService);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private overlayRef: PopoverRef | null = null;

  readonly weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  ngOnDestroy(): void { this.closeCalendar(); }

  writeValue(value: Date | string | null): void {
    if (value) {
      const date = value instanceof Date ? value : new Date(value);
      this.selectedDate.set(date);
      this.currentMonth.set(new Date(date.getFullYear(), date.getMonth(), 1));
    } else {
      this.selectedDate.set(null);
    }
  }

  registerOnChange(fn: (value: Date | null) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this._disabled = isDisabled; }

  get isDisabled(): boolean { return this.disabled() || this._disabled; }

  toggleCalendar(): void {
    if (this.isDisabled) return;
    this.isOpen() ? this.closeCalendar() : this.openCalendar();
  }

  private openCalendar(): void {
    const triggerEl = this.elementRef.nativeElement.querySelector('button');
    const content = this.createCalendarContent();
    this.overlayRef = this.popoverService.open(content, {
      triggerElement: triggerEl,
      position: 'bottom',
      offsetY: 4,
      matchWidth: false,
      onClose: () => this.isOpen.set(false),
    });
    this.isOpen.set(true);
  }

  private closeCalendar(): void {
    this.overlayRef?.close();
    this.overlayRef = null;
    this.isOpen.set(false);
  }

  private createCalendarContent(): HTMLElement {
    const container: HTMLElement = this.renderer.createElement('div');
    container.className = 'bg-base-200 border border-base-border rounded-lg shadow-lg p-4';
    container.style.cssText = 'min-width: 280px;';
    this.renderCalendar(container);
    return container;
  }

  private renderCalendar(container: HTMLElement): void {
    container.innerHTML = '';

    const header: HTMLElement = this.renderer.createElement('div');
    header.className = 'flex items-center justify-between mb-4';
    header.innerHTML = `
      <button type="button" class="p-1 rounded hover:bg-base-300 transition-colors" data-action="prev">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <span class="font-semibold text-base-content">${this.monthYearLabel}</span>
      <button type="button" class="p-1 rounded hover:bg-base-300 transition-colors" data-action="next">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    `;
    header.querySelector('[data-action="prev"]')?.addEventListener('click', () => { this.prevMonth(); this.renderCalendar(container); });
    header.querySelector('[data-action="next"]')?.addEventListener('click', () => { this.nextMonth(); this.renderCalendar(container); });
    container.appendChild(header);

    const weekdays: HTMLElement = this.renderer.createElement('div');
    weekdays.className = 'grid grid-cols-7 gap-1 mb-2';
    weekdays.innerHTML = this.weekDays.map((d) => `<div class="text-center text-xs font-medium text-base-content/70 py-1">${d}</div>`).join('');
    container.appendChild(weekdays);

    const grid: HTMLElement = this.renderer.createElement('div');
    grid.className = 'grid grid-cols-7 gap-1';

    for (const week of this.calendarDays) {
      for (const date of week) {
        if (date) {
          const btn: HTMLButtonElement = this.renderer.createElement('button');
          btn.type = 'button';
          btn.textContent = date.getDate().toString();
          btn.className = 'w-8 h-8 rounded-full text-sm transition-all focus:outline-none focus:ring-2';
          if (this.isSelectedDate(date)) { btn.classList.add('bg-primary', 'text-primary-content'); }
          else if (this.isToday(date)) { btn.classList.add('text-primary', 'font-semibold'); }
          else { btn.classList.add('text-base-content', 'hover:bg-base-300'); }
          if (this.isDateDisabled(date)) { btn.classList.add('opacity-30', 'cursor-not-allowed'); btn.disabled = true; }
          btn.addEventListener('click', () => this.selectDate(date));
          grid.appendChild(btn);
        } else {
          const empty: HTMLElement = this.renderer.createElement('div');
          empty.className = 'w-8 h-8';
          grid.appendChild(empty);
        }
      }
    }
    container.appendChild(grid);
  }

  prevMonth(): void {
    const curr = this.currentMonth();
    this.currentMonth.set(new Date(curr.getFullYear(), curr.getMonth() - 1, 1));
  }

  nextMonth(): void {
    const curr = this.currentMonth();
    this.currentMonth.set(new Date(curr.getFullYear(), curr.getMonth() + 1, 1));
  }

  selectDate(date: Date): void {
    if (this.isDateDisabled(date)) return;
    this.selectedDate.set(date);
    this._onChange(date);
    this._onTouched();
    this.dateChangeEvent.emit(date);
    this.closeCalendar();
  }

  isDateDisabled(date: Date): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    if (min && date < min) return true;
    if (max && date > max) return true;
    return false;
  }

  isSelectedDate(date: Date): boolean {
    const selected = this.selectedDate();
    if (!selected) return false;
    return date.toDateString() === selected.toDateString();
  }

  isToday(date: Date): boolean {
    return date.toDateString() === new Date().toDateString();
  }

  get calendarDays(): (Date | null)[][] {
    const month = this.currentMonth();
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) currentWeek.push(null);
    for (let day = 1; day <= lastDay.getDate(); day++) {
      currentWeek.push(new Date(year, monthIndex, day));
      if (currentWeek.length === 7) { weeks.push(currentWeek); currentWeek = []; }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeks.push(currentWeek);
    }
    return weeks;
  }

  get displayValue(): string {
    const date = this.selectedDate();
    if (!date) return '';
    return date.toLocaleDateString();
  }

  get monthYearLabel(): string {
    return this.currentMonth().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }
}
