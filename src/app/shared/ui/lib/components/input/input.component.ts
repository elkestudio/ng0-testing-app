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
import { InputShape, InputSize, InputVariant } from './input.types.js';

@Component({
  selector: 'ng0-input',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ng0InputComponent),
      multi: true,
    },
  ],
  templateUrl: './input.component.html',
  styles: [
    `
      :host { display: block; width: 100%; }
      .ng0-input-field {
        flex: 1 1 0%;
        min-width: 0;
        padding: 0 0.75rem;
        background-color: transparent;
        appearance: none;
        border: none;
        color: var(--color-base-content);
        caret-color: currentColor;
        outline: none;
        font-size: inherit;
        font-family: inherit;
        line-height: inherit;
      }
      .ng0-input-field::placeholder {
        color: var(--color-base-content);
        opacity: 0.4;
      }
      .ng0-input-field:focus { outline: none; }
      .ng0-input-xs .ng0-input-field { padding-top: 0.125rem; padding-bottom: 0.125rem; font-size: 0.625rem; }
      .ng0-input-sm .ng0-input-field { padding-top: 0.375rem; padding-bottom: 0.375rem; }
      .ng0-input-md .ng0-input-field { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .ng0-input-lg .ng0-input-field { padding-top: 1rem; padding-bottom: 1rem; }
    `,
  ],
})
export class Ng0InputComponent implements ControlValueAccessor {
  readonly inputId = input<string>('', { alias: 'id' });
  readonly inputName = input<string>('', { alias: 'name' });
  readonly type = input<string>('text');
  readonly disabled = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly placeholder = input<string>('');
  readonly readonly = input<boolean>(false);
  readonly ariaLabel = input<string>();

  readonly prefix = input<string>();
  readonly suffix = input<string>();

  /** HTML-native numeric/text constraints (forwarded via attr bindings). */
  readonly min = input<number | string | undefined>(undefined);
  readonly max = input<number | string | undefined>(undefined);
  readonly step = input<number | string | undefined>(undefined);
  readonly minLength = input<number | undefined>(undefined);
  readonly maxLength = input<number | undefined>(undefined);

  readonly variant = input<InputVariant>('outline');
  readonly shape = input<InputShape>('rounded');
  readonly size = input<InputSize>('md');

  readonly valueModel = model<any>('');

  readonly valueChange = output<any>();
  readonly inputEvent = output<any>();
  readonly blurEvent = output<void>();
  readonly focusEvent = output<void>();

  private _onChange: (value: any) => void = () => {};
  private _onTouched: () => void = () => {};
  private _disabled = false;

  readonly wrapperClasses = computed(() => {
    const shapeClasses: Record<InputShape, string> = {
      square: 'rounded-none',
      rounded: 'rounded-lg',
      pill: 'rounded-full',
    };

    const sizeClasses: Record<InputSize, string> = {
      xs: 'ng0-input-xs px-2',
      sm: 'ng0-input-sm px-3',
      md: 'ng0-input-md px-3',
      lg: 'ng0-input-lg px-3',
    };

    const variantClasses: Record<InputVariant, string> = {
      outline: 'border border-base-border bg-base-100 focus-within:ring-2 focus-within:ring-primary',
      filled: 'border-transparent bg-base-200 hover:bg-base-300 focus-within:ring-2 focus-within:ring-primary',
      ghost: 'border-transparent bg-transparent hover:bg-base-200 focus-within:ring-2 focus-within:ring-primary',
    };

    return `${shapeClasses[this.shape()]} ${sizeClasses[this.size()]} ${variantClasses[this.variant()]}`;
  });

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
    const newValue = (event.target as HTMLInputElement).value;
    this.valueModel.set(newValue);
    this.valueChange.emit(newValue);
    this._onChange(newValue);
  }

  handleInput(event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    this.valueModel.set(newValue);
    this.inputEvent.emit(newValue);
    this._onChange(newValue);
  }

  handleBlur(): void {
    this.blurEvent.emit();
    this._onTouched();
  }

  handleFocus(): void {
    this.focusEvent.emit();
  }
}
