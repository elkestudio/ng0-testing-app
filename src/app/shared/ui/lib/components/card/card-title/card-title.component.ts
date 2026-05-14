import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ng0-card-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'text-lg font-semibold text-base-content' },
  templateUrl: './card-title.component.html',
})
export class Ng0CardTitleComponent {}
