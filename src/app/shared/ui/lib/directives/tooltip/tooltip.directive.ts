import {
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
} from '@angular/core';
import { PopoverRef, PopoverService } from '../../services/popover/popover.service';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Directive({
  selector: '[ng0Tooltip]',
  standalone: true,
  host: {
    '(mouseenter)': 'onShow()',
    '(focusin)': 'onShow()',
    '(mouseleave)': 'onHide()',
    '(focusout)': 'onHide()',
    '(click)': 'onHide()',
  },
})
export class TooltipDirective implements OnDestroy {
  readonly ng0Tooltip = input<string>('');
  readonly tooltipPosition = input<TooltipPosition>('top');
  readonly tooltipDelay = input<number>(400);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly popoverService = inject(PopoverService);

  private overlayRef: PopoverRef | null = null;
  private showTimeout: ReturnType<typeof setTimeout> | null = null;

  onShow(): void {
    const text = this.ng0Tooltip();
    if (!text) return;

    this.showTimeout = setTimeout(() => {
      const tooltip = document.createElement('div');
      tooltip.role = 'tooltip';
      tooltip.textContent = text;
      tooltip.className =
        'px-2.5 py-1.5 text-[11px] font-medium bg-base-300 text-base-content rounded-md shadow-md whitespace-nowrap border border-base-border pointer-events-none';

      const pos = this.tooltipPosition();
      const offsetY = pos === 'top' ? -6 : pos === 'bottom' ? 6 : 0;

      this.overlayRef = this.popoverService.open(tooltip, {
        triggerElement: this.el.nativeElement,
        position: pos,
        offsetY,
        onClose: () => { this.overlayRef = null; },
      });
    }, this.tooltipDelay());
  }

  onHide(): void {
    this.clear();
  }

  ngOnDestroy(): void {
    this.clear();
  }

  private clear(): void {
    if (this.showTimeout !== null) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.overlayRef) {
      this.overlayRef.close();
      this.overlayRef = null;
    }
  }
}
