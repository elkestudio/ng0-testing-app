import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ng0-timeline-start',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.start]': 'true', class: 'timeline-start' },
})
export class Ng0TimelineStartComponent {}
