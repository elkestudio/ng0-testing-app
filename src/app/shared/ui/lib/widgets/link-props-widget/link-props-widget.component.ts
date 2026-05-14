import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetRowComponent, WidgetTextComponent } from '../widget-controls/index';

export interface LinkPropsChange { content?: string; href?: string; }

@Component({
  selector: 'ng0-link-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetTextComponent],
  templateUrl: './link-props-widget.component.html',
})
export class LinkPropsWidgetComponent {
  readonly content = input<string>('');
  readonly href = input<string>('');
  readonly changed = output<LinkPropsChange>();
}
