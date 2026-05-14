import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SkeletonVariant } from './skeleton.types';

@Component({
  selector: 'ng0-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skeleton.component.html',
})
export class Ng0SkeletonComponent {
  readonly variant = input<SkeletonVariant>('text');
  readonly width = input<string>();
  readonly height = input<string>();
  readonly lines = input<number>(1);
  readonly animated = input<boolean>(true);

  protected readonly lineArray = computed(() =>
    Array.from({ length: this.lines() }, (_, i) => i)
  );

  protected readonly skeletonClasses = computed(() => {
    const base = 'bg-base-300';
    const animation = this.animated() ? 'animate-pulse' : '';

    const variants: Record<SkeletonVariant, string> = {
      text: 'h-4 rounded',
      circle: 'rounded-full',
      rect: 'rounded-lg',
    };

    return `${base} ${animation} ${variants[this.variant()]}`.trim();
  });

  protected readonly skeletonStyle = computed(() => {
    const style: Record<string, string> = {};
    if (this.width()) style['width'] = this.width()!;
    if (this.height()) style['height'] = this.height()!;
    if (this.variant() === 'circle' && !this.width()) {
      style['width'] = '3rem';
      style['height'] = '3rem';
    }
    if (this.variant() === 'rect' && !this.height()) {
      style['height'] = '8rem';
    }
    return style;
  });
}
