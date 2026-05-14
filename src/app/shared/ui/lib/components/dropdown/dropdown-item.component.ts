import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ng0-dropdown-item',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host { display: block; width: 100%; }`],
  host: { '[class]': 'classes()' },
})
export class Ng0DropdownItemComponent {
  readonly disabled = input(false);
  readonly active = input(false);

  protected readonly classes = computed(() => {
    const base = 'block w-full text-left px-4 py-2 text-sm transition-colors duration-150 cursor-pointer';
    const state = this.disabled()
      ? 'opacity-50 cursor-not-allowed text-base-content/50'
      : this.active()
        ? 'bg-base-200 text-base-content font-medium'
        : 'text-base-content/70 hover:bg-base-200 hover:text-base-content';
    return `${base} ${state}`;
  });
}
