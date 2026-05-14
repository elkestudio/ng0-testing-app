import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';

export type DockPosition = 'bottom' | 'top';
export type DockSize = 'xs' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'ng0-dock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style.height.px]': 'heightPx()',
  },
  templateUrl: './dock.component.html',
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        width: 100%;
        padding-inline: 0.5rem;
        z-index: 40;
      }
    `,
  ],
})
export class Ng0DockComponent {
  readonly position = input<DockPosition>('bottom');
  readonly size = input<DockSize>('md');
  readonly fixed = input(false, {
    transform: (v: boolean | string) =>
      typeof v === 'string' ? v === '' || v === 'true' : v,
  });
  readonly floating = input(false, {
    transform: (v: boolean | string) =>
      typeof v === 'string' ? v === '' || v === 'true' : v,
  });

  protected readonly heightPx = computed(() => {
    const heights: Record<DockSize, number> = {
      xs: 40,
      sm: 48,
      md: 56,
      lg: 64,
    };
    return heights[this.size()];
  });

  protected readonly hostClasses = computed(() => {
    const base = 'bg-base-100 border-base-border';
    const borderClass =
      this.position() === 'bottom' ? 'border-t' : 'border-b';

    let positionClass = '';
    if (this.fixed()) {
      positionClass =
        this.position() === 'bottom'
          ? 'fixed bottom-0 left-0 right-0'
          : 'fixed top-0 left-0 right-0';
    }

    const floatingClass = this.floating()
      ? 'rounded-xl shadow-lg mx-auto max-w-fit border'
      : borderClass;

    return `${base} ${positionClass} ${floatingClass}`;
  });
}
