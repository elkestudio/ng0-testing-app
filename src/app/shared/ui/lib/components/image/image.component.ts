import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { ImageObjectFit, ImageLoading, ImageDecoding } from './image.types';

@Component({
  selector: 'ng0-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  host: {
    class: 'block relative overflow-hidden',
    '[attr.role]': 'decorative() ? "presentation" : "img"',
    '[attr.aria-label]': 'decorative() ? null : accessibleLabel()',
  },
  templateUrl: './image.component.html',
})
export class Ng0ImageComponent {
  /** Image source URL (required). */
  readonly src = input.required<string>();

  /** Alt text for accessibility. Empty string marks image as decorative. */
  readonly alt = input('');

  /** Explicit width in pixels. Omit when using fill mode. */
  readonly width = input<number>();

  /** Explicit height in pixels. Omit when using fill mode. */
  readonly height = input<number>();

  /**
   * Fill mode: image fills its parent container.
   * Parent must have position: relative/absolute/fixed.
   * When true, width/height are ignored.
   */
  readonly fill = input(false);

  /** Mark as priority (LCP image). Sets fetchpriority=high and loading=eager. */
  readonly priority = input(false);

  /** Object-fit CSS value. */
  readonly objectFit = input<ImageObjectFit>('cover');

  /** Loading strategy. Defaults to lazy (NgOptimizedImage default). */
  readonly loading = input<ImageLoading>();

  /** Decoding strategy. */
  readonly decoding = input<ImageDecoding>();

  /** Responsive sizes attribute for srcset selection. */
  readonly sizes = input<string>();

  /** Disable automatic srcset generation. */
  readonly disableOptimizedSrcset = input(false);

  /** Enable placeholder (requires image loader/CDN). */
  readonly placeholder = input<string | boolean>();

  /** Mark as decorative (no semantic meaning, hidden from screen readers). */
  readonly decorative = input(false);

  /** Referrer policy for the image request. */
  readonly referrerPolicy = input<string>();

  readonly accessibleLabel = computed(() => {
    return this.alt() || undefined;
  });

  readonly imageClasses = computed(() => {
    const fit = this.objectFit();
    const fitClass = fit ? `object-${fit}` : '';
    return this.fill()
      ? `absolute inset-0 w-full h-full ${fitClass}`
      : `${fitClass}`;
  });
}
