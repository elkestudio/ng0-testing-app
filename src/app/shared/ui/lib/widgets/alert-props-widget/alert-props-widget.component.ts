import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetSelectComponent, WidgetRowComponent, WidgetTextareaComponent } from '../widget-controls/index';

export interface AlertPropsChange { content?: string; variant?: string; }

@Component({
  selector: 'ng0-alert-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetSelectComponent, WidgetTextareaComponent],
  templateUrl: './alert-props-widget.component.html',
})
export class AlertPropsWidgetComponent {
  readonly content = input<string>('');
  readonly variant = input<string>('info');
  readonly changed = output<AlertPropsChange>();

  protected readonly variantOptions = [
    { value: 'info', label: 'Info' },
    { value: 'success', label: 'Success' },
    { value: 'warning', label: 'Warning' },
    { value: 'error', label: 'Error' },
  ];
}
