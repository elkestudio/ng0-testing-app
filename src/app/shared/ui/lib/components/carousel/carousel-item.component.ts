import { Component, ElementRef, inject, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ng0-carousel-item',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-full w-full relative">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        flex-shrink: 0;
        position: relative;
      }
    `,
  ],
})
export class Ng0CarouselItemComponent {
  readonly element = inject(ElementRef<HTMLElement>);
}
