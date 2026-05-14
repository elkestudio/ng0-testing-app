import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ng0-timeline-middle',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.middle]': 'true', class: 'timeline-middle' },
})
export class Ng0TimelineMiddleComponent {}
