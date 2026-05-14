import {
  Component,
  input,
  output,
  computed,
  ChangeDetectionStrategy,
  ElementRef,
  inject,
} from '@angular/core';
import { ContentPadding } from './content.types.js';

export interface ScrollEvent {
  scrollTop: number;
  scrollLeft: number;
  direction: 'up' | 'down' | 'none';
  atTop: boolean;
  atBottom: boolean;
}

@Component({
  selector: 'ng0-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '(scroll)': 'onScroll($event)',
  },
  templateUrl: './content.component.html',
  styles: [
    `
      :host {
        display: block;
        flex: 1 1 auto;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
      }
    `,
  ],
})
export class Ng0ContentComponent {
  private el = inject(ElementRef);

  readonly padding = input<ContentPadding>('none');
  readonly fullscreen = input(false, {
    transform: (v: boolean | string) =>
      typeof v === 'string' ? v === '' || v === 'true' : v,
  });

  readonly emitScroll = output<ScrollEvent>();

  private lastScrollTop = 0;

  protected readonly hostClasses = computed(() => {
    const paddingClasses: Record<ContentPadding, string> = {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    };

    const fullscreenClass = this.fullscreen()
      ? 'absolute inset-0'
      : '';

    return `${paddingClasses[this.padding()]} ${fullscreenClass}`;
  });

  onScroll(_event: Event): void {
    const el = this.el.nativeElement as HTMLElement;
    const scrollTop = el.scrollTop;
    const direction =
      scrollTop > this.lastScrollTop
        ? 'down' as const
        : scrollTop < this.lastScrollTop
          ? 'up' as const
          : 'none' as const;
    this.lastScrollTop = scrollTop;

    this.emitScroll.emit({
      scrollTop,
      scrollLeft: el.scrollLeft,
      direction,
      atTop: scrollTop <= 0,
      atBottom: scrollTop + el.clientHeight >= el.scrollHeight - 1,
    });
  }
}
