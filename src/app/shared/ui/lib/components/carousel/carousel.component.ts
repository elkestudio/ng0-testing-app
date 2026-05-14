import {
  Component,
  contentChildren,
  input,
  ElementRef,
  viewChild,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  signal,
  effect,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { Ng0IconComponent } from '../icon/icon.component';
import { Ng0CarouselItemComponent } from './carousel-item.component';
import { CarouselOptions } from './carousel.types';

@Component({
  selector: 'ng0-carousel',
  standalone: true,
  imports: [NgClass, Ng0IconComponent],
  templateUrl: './carousel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
      }
      .carousel-wrapper {
        display: flex;
        width: 100%;
        height: 100%;
        will-change: transform;
        backface-visibility: hidden;
      }
    `,
  ],
})
export class Ng0CarouselComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  readonly items = contentChildren(Ng0CarouselItemComponent);
  readonly wrapper = viewChild<ElementRef<HTMLElement>>('wrapper');
  readonly options = input<CarouselOptions>({});

  protected get opts() {
    return { loop: false, autoplay: 0, speed: 300, pagination: true, navigation: true, allowTouchMove: true, ...this.options() };
  }

  readonly activeIndex = signal(0);
  private currentTranslate = 0;
  private prevTranslate = 0;
  private startPos = 0;
  private isDragging = false;
  private animationID: number | null = null;
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;
  private readonly isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    effect(() => this.setPositionByIndex(this.activeIndex()));
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) this.startAutoplay();
  }

  ngOnDestroy(): void {
    this.stopAutoplay();
    if (this.animationID) cancelAnimationFrame(this.animationID);
  }

  next(): void {
    if (this.activeIndex() < this.items().length - 1) {
      this.activeIndex.update((i) => i + 1);
    } else if (this.opts.loop) {
      this.activeIndex.set(0);
    }
  }

  prev(): void {
    if (this.activeIndex() > 0) {
      this.activeIndex.update((i) => i - 1);
    } else if (this.opts.loop) {
      this.activeIndex.set(this.items().length - 1);
    }
  }

  goTo(index: number): void {
    if (index >= 0 && index < this.items().length) this.activeIndex.set(index);
  }

  onTouchStart(event: TouchEvent | MouseEvent): void {
    if (!this.opts.allowTouchMove) return;
    this.isDragging = true;
    this.stopAutoplay();
    this.startPos = this.getPositionX(event);
    this.prevTranslate = this.currentTranslate;
    this.animationID = requestAnimationFrame(this.animationLoop);
    const wrapper = this.wrapper()?.nativeElement;
    if (wrapper) { wrapper.style.transition = 'none'; wrapper.style.cursor = 'grabbing'; }
  }

  onTouchMove(event: TouchEvent | MouseEvent): void {
    if (!this.isDragging) return;
    this.currentTranslate = this.prevTranslate + (this.getPositionX(event) - this.startPos);
  }

  onTouchEnd(): void {
    if (!this.isDragging) return;
    this.isDragging = false;
    if (this.animationID) cancelAnimationFrame(this.animationID);
    const wrapper = this.wrapper()?.nativeElement;
    if (wrapper) {
      wrapper.style.transition = `transform ${this.opts.speed}ms cubic-bezier(0.25, 1, 0.5, 1)`;
      wrapper.style.cursor = 'grab';
    }
    const movedBy = this.currentTranslate - this.prevTranslate;
    if (movedBy < -100) { this.next(); }
    else if (movedBy > 100) { this.prev(); }
    else { this.setPositionByIndex(this.activeIndex()); }
    this.startAutoplay();
  }

  private readonly animationLoop = (): void => {
    if (this.isDragging) {
      this.setSliderPosition();
      requestAnimationFrame(this.animationLoop);
    }
  };

  private getPositionX(event: TouchEvent | MouseEvent): number {
    return event instanceof TouchEvent ? event.touches[0].clientX : event.clientX;
  }

  private setSliderPosition(): void {
    const wrapper = this.wrapper()?.nativeElement;
    if (wrapper) wrapper.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  private setPositionByIndex(index: number): void {
    const wrapper = this.wrapper()?.nativeElement;
    if (wrapper) {
      this.currentTranslate = index * -wrapper.offsetWidth;
      this.prevTranslate = this.currentTranslate;
      wrapper.style.transform = `translateX(${this.currentTranslate}px)`;
    }
  }

  private startAutoplay(): void {
    if (this.opts.autoplay && this.opts.autoplay > 0) {
      this.stopAutoplay();
      this.autoplayTimer = setInterval(() => this.next(), this.opts.autoplay);
    }
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) { clearInterval(this.autoplayTimer); this.autoplayTimer = null; }
  }
}
