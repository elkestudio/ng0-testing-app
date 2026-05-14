import {
  Component,
  input,
  output,
  model,
  computed,
  ChangeDetectionStrategy,
  forwardRef,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
}

@Component({
  selector: 'ng0-select',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ng0SelectComponent),
      multi: true,
    },
  ],
  templateUrl: './select.component.html',
  styles: [
    `
      :host { display: block; width: 100%; }
      .ng0-select-field {
        flex: 1;
        min-width: 0;
        padding: 0.75rem;
        background-color: transparent;
        appearance: none;
        border: none;
        color: var(--color-base-content);
        outline: none;
        font-size: inherit;
        font-family: inherit;
        width: 100%;
        cursor: pointer;
      }
    `,
  ],
})
export class Ng0SelectComponent implements ControlValueAccessor {
  readonly options = input<SelectOption[]>([]);
  readonly placeholder = input<string>('');
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string>();

  readonly valueModel = model<any>('');
  readonly valueChange = output<any>();

  private _onChange: (value: any) => void = () => {};
  private _onTouched: () => void = () => {};
  private _disabled = false;

  readonly wrapperClasses = computed(() =>
    'flex items-center w-full rounded-lg border border-base-border bg-base-100 px-1 focus-within:ring-2 focus-within:ring-primary'
  );

  get isDisabled(): boolean {
    return this.disabled() || this._disabled;
  }

  writeValue(value: any): void {
    this.valueModel.set(value);
  }

  registerOnChange(fn: (value: any) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  handleChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.valueModel.set(value);
    this.valueChange.emit(value);
    this._onChange(value);
    this._onTouched();
  }
}
