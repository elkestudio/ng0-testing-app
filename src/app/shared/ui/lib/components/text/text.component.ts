import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { TextSize } from './text.types.js';

@Component({
  selector: 'ng0-text',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './text.component.html',
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
  host: {
    '[class]': 'classes()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.role]': 'role()',
    '[attr.aria-level]': 'level()',
    '[attr.id]': 'id()',
  },
})
export class Ng0TextComponent {
  readonly size = input<TextSize>('base');
  readonly content = input<string>();
  readonly class = input<string>('');

  readonly ariaLabel = input<string>();
  readonly role = input<string>();
  readonly level = input<string | number>();
  readonly id = input<string>();

  readonly classes = computed(() => {
    const sizeClass = `text-${this.size()}`;
    const baseContentClass = 'text-base-content';
    return `${baseContentClass} ${sizeClass} ${this.class()}`;
  });
}
