import {
  Component,
  input,
  output,
  signal,
  ChangeDetectionStrategy,
  forwardRef,
  viewChildren,
  ElementRef,
  AfterViewInit,
  computed,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'ng0-otp-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './otp-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ng0OtpInputComponent),
      multi: true,
    },
  ],
})
export class Ng0OtpInputComponent implements ControlValueAccessor, AfterViewInit {
  readonly length = input<number>(6);
  readonly disabled = input<boolean>(false);
  readonly masked = input<boolean>(false);
  readonly autofocus = input<boolean>(false);

  readonly completeEvent = output<string>();

  values = signal<string[]>([]);
  readonly otpInputs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};
  private _disabled = false;

  ngAfterViewInit(): void {
    this.values.set(new Array(this.length()).fill(''));
    if (this.autofocus() && this.otpInputs().length > 0) {
      setTimeout(() => this.otpInputs()[0].nativeElement.focus(), 0);
    }
  }

  writeValue(value: string): void {
    if (value) {
      const chars = value.split('').slice(0, this.length());
      this.values.set([...chars, ...new Array(this.length() - chars.length).fill('')]);
    } else {
      this.values.set(new Array(this.length()).fill(''));
    }
  }

  registerOnChange(fn: (value: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this._disabled = isDisabled; }

  get isDisabled(): boolean { return this.disabled() || this._disabled; }

  onInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '').slice(-1);
    const current = [...this.values()];
    current[index] = value;
    this.values.set(current);
    const code = current.join('');
    this._onChange(code);
    if (value && index < this.length() - 1) this.focusInput(index + 1);
    if (current.every((v) => v !== '')) {
      this.completeEvent.emit(code);
      this._onTouched();
    }
  }

  onKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      const current = [...this.values()];
      if (!current[index] && index > 0) {
        current[index - 1] = '';
        this.values.set(current);
        this.focusInput(index - 1);
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focusInput(index - 1);
    } else if (event.key === 'ArrowRight' && index < this.length() - 1) {
      this.focusInput(index + 1);
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text').replace(/[^0-9]/g, '');
    if (pasted) {
      const chars = pasted.split('').slice(0, this.length());
      const padded = [...chars, ...new Array(this.length() - chars.length).fill('')];
      this.values.set(padded);
      const code = padded.join('');
      this._onChange(code);
      if (chars.length === this.length()) this.completeEvent.emit(code);
      this.focusInput(Math.min(chars.length, this.length() - 1));
    }
  }

  private focusInput(index: number): void {
    const inputs = this.otpInputs();
    if (inputs[index]) {
      inputs[index].nativeElement.focus();
      inputs[index].nativeElement.select();
    }
  }

  readonly inputsArray = computed(() => new Array(this.length()).fill(0).map((_, i) => i));
}
