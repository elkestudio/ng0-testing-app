import {
  Component,
  input,
  model,
  output,
  computed,
  signal,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RangeSize, RangeColor } from './range.types';

@Component({
  selector: 'ng0-range',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ng0RangeComponent),
      multi: true,
    },
  ],
  styles: [`
    input[type='range'] {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      background: transparent;
      cursor: pointer;
    }
    input[type='range']::-webkit-slider-runnable-track {
      height: 0.5rem;
      border-radius: 9999px;
      background: var(--color-base-300, #e2e8f0);
    }
    input[type='range']::-moz-range-track {
      height: 0.5rem;
      border-radius: 9999px;
      background: var(--color-base-300, #e2e8f0);
    }
    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background: var(--range-color, var(--color-primary));
      margin-top: -0.375rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    input[type='range']::-moz-range-thumb {
      width: 1.25rem;
      height: 1.25rem;
      border-radius: 50%;
      background: var(--range-color, var(--color-primary));
      border: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    input[type='range']:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .range-xs::-webkit-slider-thumb { width: 0.75rem; height: 0.75rem; margin-top: -0.125rem; }
    .range-xs::-webkit-slider-runnable-track { height: 0.25rem; }
    .range-sm::-webkit-slider-thumb { width: 1rem; height: 1rem; margin-top: -0.25rem; }
    .range-sm::-webkit-slider-runnable-track { height: 0.375rem; }
    .range-lg::-webkit-slider-thumb { width: 1.5rem; height: 1.5rem; margin-top: -0.5rem; }
    .range-lg::-webkit-slider-runnable-track { height: 0.625rem; }
  `],
  templateUrl: './range.component.html',
})
export class Ng0RangeComponent implements ControlValueAccessor {
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly step = input<number>(1);
  readonly size = input<RangeSize>('md');
  readonly color = input<RangeColor>('primary');
  readonly showTicks = input<boolean>(false);
  readonly tickLabels = input<string[]>([]);
  readonly disabled = input<boolean>(false);

  readonly value = model<number>(0);
  readonly valueChange = output<number>();

  protected readonly isDisabled = signal(false);

  private _onChange: (value: number) => void = () => {};
  private _onTouched: () => void = () => {};

  protected readonly colorVar = computed(() => {
    const colors: Record<RangeColor, string> = {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      accent: 'var(--color-accent)',
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      error: 'var(--color-error)',
      info: 'var(--color-info)',
      neutral: 'var(--color-neutral)',
    };
    return colors[this.color()];
  });

  protected readonly rangeClass = computed(() => `range-${this.size()}`);

  protected onInput(event: Event): void {
    const val = Number((event.target as HTMLInputElement).value);
    this.value.set(val);
    this._onChange(val);
    this.valueChange.emit(val);
  }

  protected onBlur(): void {
    this._onTouched();
  }

  writeValue(val: number): void {
    this.value.set(val ?? 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
