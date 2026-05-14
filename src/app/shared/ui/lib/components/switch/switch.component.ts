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
import { SwitchSize, SwitchColor } from './switch.types';

@Component({
  selector: 'ng0-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ng0SwitchComponent),
      multi: true,
    },
  ],
  templateUrl: './switch.component.html',
})
export class Ng0SwitchComponent implements ControlValueAccessor {
  readonly label = input<string>();
  readonly size = input<SwitchSize>('md');
  readonly color = input<SwitchColor>('primary');
  readonly disabled = input<boolean>(false);

  readonly checked = model<boolean>(false);
  readonly checkedChange = output<boolean>();

  protected readonly isDisabled = signal(false);

  private _onChange: (value: boolean) => void = () => {};
  private _onTouched: () => void = () => {};

  get isOff(): boolean {
    return this.disabled() || this.isDisabled();
  }

  protected readonly trackClasses = computed(() => {
    const sizes: Record<SwitchSize, string> = {
      xs: 'w-7 h-4',
      sm: 'w-9 h-5',
      md: 'w-11 h-6',
      lg: 'w-14 h-7',
    };
    const checkedColors: Record<SwitchColor, string> = {
      primary: 'peer-checked:bg-primary',
      secondary: 'peer-checked:bg-secondary',
      accent: 'peer-checked:bg-accent',
      success: 'peer-checked:bg-success',
      warning: 'peer-checked:bg-warning',
      error: 'peer-checked:bg-error',
      info: 'peer-checked:bg-info',
    };
    return `relative block rounded-full bg-base-300 transition-colors duration-200 ${sizes[this.size()]} ${checkedColors[this.color()]}`;
  });

  protected readonly thumbClasses = computed(() => {
    const sizes: Record<SwitchSize, string> = {
      xs: 'w-3 h-3 top-0.5 left-0.5 peer-checked:translate-x-3',
      sm: 'w-4 h-4 top-0.5 left-0.5 peer-checked:translate-x-4',
      md: 'w-5 h-5 top-0.5 left-0.5 peer-checked:translate-x-5',
      lg: 'w-6 h-6 top-0.5 left-0.5 peer-checked:translate-x-7',
    };
    return `absolute rounded-full bg-white shadow transition-transform duration-200 ${sizes[this.size()]}`;
  });

  toggle(): void {
    if (this.isOff) return;
    const newVal = !this.checked();
    this.checked.set(newVal);
    this._onChange(newVal);
    this._onTouched();
    this.checkedChange.emit(newVal);
  }

  writeValue(val: boolean): void {
    this.checked.set(!!val);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }
}
