import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ng0-card-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block text-sm text-base-content/80' },
  templateUrl: './card-content.component.html',
})
export class Ng0CardContentComponent {}
