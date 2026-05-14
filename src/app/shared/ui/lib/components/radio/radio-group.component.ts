import {
  Component,
  input,
  model,
  output,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioSize, RadioColor } from './radio.types';
import { Ng0RadioComponent } from './radio.component';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ng0-radio-group',
  standalone: true,
  imports: [Ng0RadioComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ng0RadioGroupComponent),
      multi: true,
    },
  ],
  templateUrl: './radio-group.component.html',
})
export class Ng0RadioGroupComponent implements ControlValueAccessor {
  readonly options = input<RadioOption[]>([]);
  readonly radioSize = input<RadioSize>('md');
  readonly color = input<RadioColor>('primary');
  readonly direction = input<'row' | 'column'>('column');
  readonly disabled = input<boolean>(false);

  readonly value = model<string>('');
  readonly valueChange = output<string>();

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};
  private _disabled = false;

  get isDisabled(): boolean {
    return this.disabled() || this._disabled;
  }

  onSelect(val: string): void {
    if (this.isDisabled) return;
    this.value.set(val);
    this._onChange(val);
    this._onTouched();
    this.valueChange.emit(val);
  }

  writeValue(val: string): void {
    this.value.set(val ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }
}
