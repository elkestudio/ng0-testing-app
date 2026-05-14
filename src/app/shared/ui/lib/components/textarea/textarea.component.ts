import {
  Component,
  input,
  model,
  output,
  computed,
  ChangeDetectionStrategy,
  forwardRef,
  ElementRef,
  viewChild,
  AfterViewInit,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { TextareaVariant, TextareaSize } from './textarea.types';

@Component({
  selector: 'ng0-textarea',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ng0TextareaComponent),
      multi: true,
    },
  ],
  templateUrl: './textarea.component.html',
})
export class Ng0TextareaComponent implements ControlValueAccessor, AfterViewInit {
  readonly placeholder = input<string>('');
  readonly variant = input<TextareaVariant>('bordered');
  readonly textareaSize = input<TextareaSize>('md');
  readonly rows = input<number>(3);
  readonly autoResize = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly maxLength = input<number>();
  readonly ariaLabel = input<string>();

  readonly value = model<string>('');
  readonly valueChange = output<string>();

  protected readonly textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textareaEl');

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};
  private _disabled = false;

  protected readonly textareaClasses = computed(() => {
    const variants: Record<TextareaVariant, string> = {
      bordered: 'border border-base-border bg-base-100 focus:border-primary',
      ghost: 'border-transparent bg-transparent focus:bg-base-100 focus:border-base-border',
    };

    const sizes: Record<TextareaSize, string> = {
      sm: 'text-sm px-2.5 py-1.5',
      md: 'text-sm px-3 py-2',
      lg: 'text-base px-4 py-2.5',
    };

    return `w-full rounded-lg text-base-content placeholder:text-base-content/40 outline-none transition-colors resize-y ${variants[this.variant()]} ${sizes[this.textareaSize()]}`;
  });

  get isDisabled(): boolean {
    return this.disabled() || this._disabled;
  }

  ngAfterViewInit(): void {
    if (this.autoResize()) {
      this.adjustHeight();
    }
  }

  protected onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const val = target.value;
    this.value.set(val);
    this.valueChange.emit(val);
    this._onChange(val);
    if (this.autoResize()) {
      this.adjustHeight();
    }
  }

  protected onBlur(): void {
    this._onTouched();
  }

  private adjustHeight(): void {
    const el = this.textareaRef()?.nativeElement;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }

  writeValue(value: string): void {
    this.value.set(value ?? '');
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
