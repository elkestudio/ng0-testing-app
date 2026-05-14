import { Component, input, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ng0-timeline',
  standalone: true,
  imports: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline.component.html',
  styles: [
    `
      .timeline {
        display: flex;
        position: relative;
      }
      .timeline:not(.timeline-vertical) {
        flex-direction: row;
      }
      .timeline.timeline-vertical {
        flex-direction: column;
      }
      .timeline-item {
        display: grid;
        flex-shrink: 0;
        align-items: center;
        grid-template-columns: 1fr auto 1fr;
        grid-template-rows: auto 1fr;
      }
      .timeline.timeline-vertical .timeline-item {
        grid-template-columns: 1fr auto 1fr;
        grid-template-rows: auto;
      }
      .timeline-middle {
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1;
        grid-column-start: 2;
        grid-row-start: 1;
      }
      .timeline-start {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 4;
        align-self: center;
        justify-self: end;
        padding: 0.5rem;
      }
      .timeline-end {
        grid-column-start: 3;
        grid-column-end: 4;
        grid-row-start: 1;
        grid-row-end: 4;
        align-self: center;
        justify-self: start;
        padding: 0.5rem;
      }
      .timeline-item hr {
        grid-column-start: 2;
        grid-column-end: auto;
        grid-row-start: 1;
        grid-row-end: auto;
        border: none;
        background-color: var(--color-base-border, #e5e7eb);
        width: 100%;
        height: 2px;
      }
      .timeline-item hr:first-child {
        grid-column-start: 1;
        grid-column-end: 2;
      }
      .timeline-item hr:last-child {
        grid-column-start: 3;
        grid-column-end: 4;
      }
      .timeline.timeline-vertical .timeline-start {
        grid-column-start: 1;
        grid-column-end: 2;
        grid-row-start: 1;
        grid-row-end: 4;
        align-self: center;
        justify-self: end;
        text-align: end;
      }
      .timeline.timeline-vertical .timeline-end {
        grid-column-start: 3;
        grid-column-end: 4;
        grid-row-start: 1;
        grid-row-end: 4;
        align-self: center;
        justify-self: start;
        text-align: start;
      }
      .timeline.timeline-vertical .timeline-item hr {
        width: 2px;
        height: 100%;
        min-height: 2rem;
        justify-self: center;
      }
      .timeline.timeline-vertical .timeline-item hr:first-child {
        grid-column-start: 2;
        grid-column-end: auto;
        grid-row-start: 1;
        grid-row-end: 2;
      }
      .timeline.timeline-vertical .timeline-item hr:last-child {
        grid-column-start: 2;
        grid-column-end: auto;
        grid-row-start: 3;
        grid-row-end: 4;
      }
      .timeline.timeline-vertical .timeline-middle {
        grid-column-start: 2;
        grid-column-end: auto;
        grid-row-start: 2;
        grid-row-end: 3;
      }
      .timeline.timeline-compact .timeline-item {
        gap: 0.25rem;
      }
      .timeline-item:first-child hr:first-of-type {
        visibility: hidden;
      }
      .timeline-item:last-child hr:last-of-type {
        visibility: hidden;
      }
    `,
  ],
})
export class Ng0TimelineComponent {
  readonly vertical = input<boolean>(true);
  readonly compact = input<boolean>(false);
}
