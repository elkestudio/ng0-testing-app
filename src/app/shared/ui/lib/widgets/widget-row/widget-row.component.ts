import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

export type WidgetRowLayout = 'inline' | 'stacked';

@Component({
  selector: 'ng0-widget-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './widget-row.component.html',
  host: { class: 'block' },
})
export class WidgetRowComponent {
  readonly label = input<string>('');
  readonly layout = input<WidgetRowLayout>('inline');

  protected readonly containerClass = computed(() =>
    this.layout() === 'stacked'
      ? 'flex flex-col gap-1'
      : 'flex items-center justify-between gap-3',
  );

  protected readonly labelClass = computed(() =>
    this.layout() === 'stacked'
      ? 'text-[9px] text-base-content/40 uppercase tracking-wider'
      : 'text-[9px] text-base-content/40 uppercase tracking-wider shrink-0',
  );
}
