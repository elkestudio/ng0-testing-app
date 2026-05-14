import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ng0-card-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex items-center gap-2 pb-3 border-b border-base-border mb-3' },
  templateUrl: './card-header.component.html',
})
export class Ng0CardHeaderComponent {}
