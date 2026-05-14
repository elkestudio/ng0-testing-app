import {
  Component,
  input,
  model,
  output,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'ng0-toggle',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ng0ToggleComponent),
      multi: true,
    },
  ],
  templateUrl: './toggle.component.html',
})
export class Ng0ToggleComponent implements ControlValueAccessor {
  readonly label = input<string>();
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string>();

  readonly checked = model<boolean>(false);
  readonly checkedChange = output<boolean>();

  private _onChange: (value: boolean) => void = () => {};
  private _onTouched: () => void = () => {};
  private _disabled = false;

  get isDisabled(): boolean {
    return this.disabled() || this._disabled;
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  toggle(): void {
    if (this.isDisabled) return;
    const newValue = !this.checked();
    this.checked.set(newValue);
    this.checkedChange.emit(newValue);
    this._onChange(newValue);
    this._onTouched();
  }
}
