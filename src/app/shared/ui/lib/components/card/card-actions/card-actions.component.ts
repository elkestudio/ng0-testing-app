import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ng0-card-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex items-center gap-2 pt-3 border-t border-base-border mt-3' },
  templateUrl: './card-actions.component.html',
})
export class Ng0CardActionsComponent {}
