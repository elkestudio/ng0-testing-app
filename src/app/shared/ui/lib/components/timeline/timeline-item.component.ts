import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ng0-timeline-item',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timeline-item.component.html',
})
export class Ng0TimelineItemComponent {
  readonly connectBefore = input<string>('');
  readonly connectAfter = input<string>('');
}
