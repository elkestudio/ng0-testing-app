import {
  Component,
  input,
  output,
  signal,
  computed,
  ChangeDetectionStrategy,
  forwardRef,
  inject,
  OnDestroy,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { PopoverService, PopoverRef } from '../../services/popover/popover.service';
import { AutocompleteOption } from './autocomplete.types';

@Component({
  selector: 'ng0-autocomplete',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './autocomplete.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Ng0AutocompleteComponent),
      multi: true,
    },
  ],
  host: {
    '[attr.role]': '"combobox"',
    '[attr.aria-expanded]': 'isOpen()',
    '[attr.aria-haspopup]': '"listbox"',
  },
})
export class Ng0AutocompleteComponent implements ControlValueAccessor, OnDestroy {
  readonly options = input<AutocompleteOption[]>([]);
  readonly placeholder = input<string>('Search...');
  readonly disabled = input<boolean>(false);
  readonly minChars = input<number>(1);

  readonly selectEvent = output<AutocompleteOption>();
  readonly searchEvent = output<string>();

  readonly query = signal('');
  readonly isOpen = signal(false);
  readonly highlightedIndex = signal(-1);

  readonly filteredOptions = computed(() => {
    const q = this.query().toLowerCase();
    if (q.length < this.minChars()) return [];
    return this.options().filter((opt) => opt.label.toLowerCase().includes(q));
  });

  private _onChange: (value: string) => void = () => {};
  private _onTouched: () => void = () => {};
  private _disabled = false;

  private readonly popoverService = inject(PopoverService);
  private readonly elementRef = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private overlayRef: PopoverRef | null = null;

  ngOnDestroy(): void { this.closeDropdown(); }

  writeValue(value: string): void { this.query.set(value || ''); }
  registerOnChange(fn: (value: string) => void): void { this._onChange = fn; }
  registerOnTouched(fn: () => void): void { this._onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this._disabled = isDisabled; }

  get isDisabled(): boolean { return this.disabled() || this._disabled; }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.searchEvent.emit(value);
    this.highlightedIndex.set(-1);
    if (value.length >= this.minChars() && this.filteredOptions().length > 0) {
      this.openDropdown();
    } else {
      this.closeDropdown();
    }
  }

  onFocus(): void {
    if (this.query().length >= this.minChars() && this.filteredOptions().length > 0) {
      this.openDropdown();
    }
  }

  private openDropdown(): void {
    if (this.isOpen()) { this.updateDropdown(); return; }
    const triggerEl = this.elementRef.nativeElement.querySelector('input');
    const content = this.createDropdownContent();
    this.overlayRef = this.popoverService.open(content, {
      triggerElement: triggerEl,
      position: 'bottom',
      offsetY: 4,
      matchWidth: true,
      onClose: () => this.isOpen.set(false),
    });
    this.isOpen.set(true);
  }

  private closeDropdown(): void {
    this.overlayRef?.close();
    this.overlayRef = null;
    this.isOpen.set(false);
  }

  private updateDropdown(): void {
    this.closeDropdown();
    if (this.filteredOptions().length > 0) this.openDropdown();
  }

  private createDropdownContent(): HTMLElement {
    const container: HTMLElement = this.renderer.createElement('ul');
    container.className = 'bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-auto';
    container.setAttribute('role', 'listbox');
    container.id = 'ng0-autocomplete-list';
    this.filteredOptions().forEach((option, index) => {
      const li: HTMLElement = this.renderer.createElement('li');
      li.className = 'px-4 py-2 cursor-pointer transition-colors hover:bg-base-200 text-base-content';
      li.setAttribute('role', 'option');
      li.textContent = option.label;
      if (option.disabled) {
        li.classList.add('opacity-50', 'cursor-not-allowed');
        li.classList.remove('cursor-pointer');
      }
      li.addEventListener('click', () => { if (!option.disabled) this.selectOption(option); });
      li.addEventListener('mouseenter', () => this.highlightedIndex.set(index));
      container.appendChild(li);
    });
    return container;
  }

  selectOption(option: AutocompleteOption): void {
    if (option.disabled) return;
    this.query.set(option.label);
    this._onChange(option.value);
    this._onTouched();
    this.selectEvent.emit(option);
    this.closeDropdown();
  }

  onKeydown(event: KeyboardEvent): void {
    const opts = this.filteredOptions();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex.set(Math.min(this.highlightedIndex() + 1, opts.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex.set(Math.max(this.highlightedIndex() - 1, 0));
        break;
      case 'Enter': {
        event.preventDefault();
        const highlighted = opts[this.highlightedIndex()];
        if (highlighted) this.selectOption(highlighted);
        break;
      }
      case 'Escape':
        this.closeDropdown();
        break;
    }
  }
}
