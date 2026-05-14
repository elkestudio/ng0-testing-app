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
import { PopoverService, PopoverRef } from '../../services/popover/popover.service';
import { Ng0IconComponent } from '../icon/icon.component';
import { TimeValue } from './time-picker.types';

@Component({
  selector: 'ng0-time-picker',
  standalone: true,
  imports: [FormsModule, Ng0IconComponent],
  templateUrl: './time-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ng0TimePickerComponent),
      multi: true,
    },
  ],
})
export class Ng0TimePickerComponent implements ControlValueAccessor, OnDestroy {
  readonly placeholder = input<string>('Select time');
  readonly disabled = input<boolean>(false);
  readonly use24Hour = input<boolean>(false);
  readonly minuteStep = input<number>(1);

  readonly timeChangeEvent = output<TimeValue | null>();

  readonly isOpen = signal(false);
  readonly selectedHours = signal<number>(12);
  readonly selectedMinutes = signal<number>(0);
  readonly selectedPeriod = signal<'AM' | 'PM'>('AM');

  private _onChange: (value: TimeValue | null) => void = () => {};
  private _onTouched: () => void = () => {};
  private _disabled = false;

  private readonly popoverService = inject(PopoverService);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private overlayRef: PopoverRef | null = null;

  ngOnDestroy(): void { this.closePicker(); }

  writeValue(value: TimeValue | string | null): void {
    if (value) {
      if (typeof value === 'string') {
        const [h, m] = value.split(':').map(Number);
        this.setTime(h, m);
      } else {
        this.setTime(value.hours, value.minutes);
      }
    }
  }

  private setTime(hours: number, minutes: number): void {
    if (this.use24Hour()) {
      this.selectedHours.set(hours);
    } else {
      this.selectedPeriod.set(hours >= 12 ? 'PM' : 'AM');
      this.selectedHours.set(hours % 12 || 12);
    }
    this.selectedMinutes.set(minutes);
  }

  registerOnChange(fn: (value: TimeValue | null) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this._disabled = isDisabled; }

  get isDisabled(): boolean { return this.disabled() || this._disabled; }

  togglePicker(): void {
    if (this.isDisabled) return;
    this.isOpen() ? this.closePicker() : this.openPicker();
  }

  private openPicker(): void {
    const triggerEl = this.elementRef.nativeElement.querySelector('button');
    const content = this.createPickerContent();
    this.overlayRef = this.popoverService.open(content, {
      triggerElement: triggerEl,
      position: 'bottom',
      offsetY: 4,
      onClose: () => this.isOpen.set(false),
    });
    this.isOpen.set(true);
  }

  private closePicker(): void {
    this.overlayRef?.close();
    this.overlayRef = null;
    this.isOpen.set(false);
  }

  private createPickerContent(): HTMLElement {
    const container: HTMLElement = this.renderer.createElement('div');
    container.className = 'bg-base-200 border border-base-border rounded-lg shadow-lg p-4';
    this.renderPicker(container);
    return container;
  }

  private renderPicker(container: HTMLElement): void {
    container.innerHTML = '';
    const wrapper: HTMLElement = this.renderer.createElement('div');
    wrapper.className = 'flex items-center gap-4';

    wrapper.appendChild(this.createNumberColumn(this.selectedHours(), () => this.incrementHours(), () => this.decrementHours(), container));

    const sep: HTMLElement = this.renderer.createElement('span');
    sep.className = 'text-2xl font-semibold text-base-content';
    sep.textContent = ':';
    wrapper.appendChild(sep);

    wrapper.appendChild(this.createNumberColumn(this.selectedMinutes(), () => this.incrementMinutes(), () => this.decrementMinutes(), container));

    if (!this.use24Hour()) {
      const periodBtn: HTMLButtonElement = this.renderer.createElement('button');
      periodBtn.type = 'button';
      periodBtn.className = 'px-3 py-2 rounded-lg bg-base-100 text-base-content font-medium transition-colors hover:bg-primary hover:text-primary-content';
      periodBtn.textContent = this.selectedPeriod();
      periodBtn.addEventListener('click', () => {
        this.togglePeriod();
        periodBtn.textContent = this.selectedPeriod();
      });
      wrapper.appendChild(periodBtn);
    }

    container.appendChild(wrapper);

    const confirmBtn: HTMLButtonElement = this.renderer.createElement('button');
    confirmBtn.type = 'button';
    confirmBtn.className = 'w-full mt-4 py-2 bg-primary text-primary-content rounded-lg font-medium transition-colors hover:bg-primary/90';
    confirmBtn.textContent = 'Confirm';
    confirmBtn.addEventListener('click', () => this.confirm());
    container.appendChild(confirmBtn);
  }

  private createNumberColumn(value: number, onIncrement: () => void, onDecrement: () => void, container: HTMLElement): HTMLElement {
    const col: HTMLElement = this.renderer.createElement('div');
    col.className = 'flex flex-col items-center';

    const upBtn: HTMLButtonElement = this.renderer.createElement('button');
    upBtn.type = 'button';
    upBtn.className = 'p-1 rounded hover:bg-base-300 transition-colors';
    upBtn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/></svg>`;
    upBtn.addEventListener('click', () => { onIncrement(); this.renderPicker(container); });
    col.appendChild(upBtn);

    const display: HTMLElement = this.renderer.createElement('span');
    display.className = 'text-2xl font-semibold text-base-content py-2 w-12 text-center';
    display.textContent = value.toString().padStart(2, '0');
    col.appendChild(display);

    const downBtn: HTMLButtonElement = this.renderer.createElement('button');
    downBtn.type = 'button';
    downBtn.className = 'p-1 rounded hover:bg-base-300 transition-colors';
    downBtn.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>`;
    downBtn.addEventListener('click', () => { onDecrement(); this.renderPicker(container); });
    col.appendChild(downBtn);

    return col;
  }

  incrementHours(): void {
    const max = this.use24Hour() ? 23 : 12;
    const min = this.use24Hour() ? 0 : 1;
    let h = this.selectedHours() + 1;
    if (h > max) h = min;
    this.selectedHours.set(h);
  }

  decrementHours(): void {
    const max = this.use24Hour() ? 23 : 12;
    const min = this.use24Hour() ? 0 : 1;
    let h = this.selectedHours() - 1;
    if (h < min) h = max;
    this.selectedHours.set(h);
  }

  incrementMinutes(): void {
    let m = this.selectedMinutes() + this.minuteStep();
    if (m >= 60) m = 0;
    this.selectedMinutes.set(m);
  }

  decrementMinutes(): void {
    let m = this.selectedMinutes() - this.minuteStep();
    if (m < 0) m = 60 - this.minuteStep();
    this.selectedMinutes.set(m);
  }

  togglePeriod(): void {
    this.selectedPeriod.set(this.selectedPeriod() === 'AM' ? 'PM' : 'AM');
  }

  confirm(): void {
    const time = this.timeValue;
    this._onChange(time);
    this._onTouched();
    this.timeChangeEvent.emit(time);
    this.closePicker();
  }

  get timeValue(): TimeValue {
    let hours = this.selectedHours();
    if (!this.use24Hour()) {
      if (this.selectedPeriod() === 'PM' && hours !== 12) hours += 12;
      if (this.selectedPeriod() === 'AM' && hours === 12) hours = 0;
    }
    return { hours, minutes: this.selectedMinutes() };
  }

  get displayValue(): string {
    const h = this.selectedHours().toString().padStart(2, '0');
    const m = this.selectedMinutes().toString().padStart(2, '0');
    return this.use24Hour() ? `${h}:${m}` : `${h}:${m} ${this.selectedPeriod()}`;
  }
}
