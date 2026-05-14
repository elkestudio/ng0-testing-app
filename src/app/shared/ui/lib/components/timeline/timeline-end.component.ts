import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ng0-timeline-end',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.end]': 'true', class: 'timeline-end' },
})
export class Ng0TimelineEndComponent {}
