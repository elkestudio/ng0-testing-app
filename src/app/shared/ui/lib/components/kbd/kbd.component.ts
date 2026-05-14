import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { KbdSize } from './kbd.types';

@Component({
  selector: 'ng0-kbd',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kbd.component.html',
})
export class Ng0KbdComponent {
  readonly size = input<KbdSize>('md');

  protected readonly kbdClasses = computed(() => {
    const sizes: Record<KbdSize, string> = {
      xs: 'text-xs px-1 py-0 min-w-4',
      sm: 'text-xs px-1.5 py-0.5 min-w-5',
      md: 'text-sm px-2 py-0.5 min-w-6',
      lg: 'text-base px-2.5 py-1 min-w-7',
    };
    return `inline-flex items-center justify-center font-mono rounded border border-base-300 bg-base-200 text-base-content shadow-sm ${sizes[this.size()]}`;
  });
}
