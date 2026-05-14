import {
  Directive,
  ElementRef,
  PLATFORM_ID,
  AfterViewInit,
  OnDestroy,
  input,
  signal,
  effect,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[ng0LineClamp]',
  standalone: true,
  exportAs: 'ng0LineClamp',
})
export class LineClampDirective implements AfterViewInit, OnDestroy {
  readonly ng0LineClamp = input<number>(2);

  readonly expanded = signal(false);
  readonly isTruncated = signal(false);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    effect(() => {
      this.updateStyles();
      this.checkTruncation();
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkTruncation();
      this.resizeObserver = new ResizeObserver(() => this.checkTruncation());
      this.resizeObserver.observe(this.el.nativeElement);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  toggle(): void {
    this.expanded.update((v) => !v);
  }

  private updateStyles(): void {
    const el = this.el.nativeElement as HTMLElement;
    el.style.display = '-webkit-box';
    el.style.webkitBoxOrient = 'vertical';
    el.style.overflow = 'hidden';
    el.style.webkitLineClamp = this.expanded() ? 'none' : String(this.ng0LineClamp());
  }

  private checkTruncation(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    requestAnimationFrame(() => {
      const el = this.el.nativeElement as HTMLElement;
      if (this.expanded()) {
        const lineHeight = parseInt(window.getComputedStyle(el).lineHeight);
        if (!isNaN(lineHeight)) {
          this.isTruncated.set(el.scrollHeight > lineHeight * this.ng0LineClamp());
        }
      } else {
        this.isTruncated.set(el.scrollHeight > el.clientHeight);
      }
    });
  }
}
