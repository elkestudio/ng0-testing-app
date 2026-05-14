import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetRowComponent, WidgetTextComponent, WidgetTextareaComponent } from '../widget-controls/index';

export interface AccordionPropsChange { title?: string; content?: string; }

@Component({
  selector: 'ng0-accordion-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetTextComponent, WidgetTextareaComponent],
  templateUrl: './accordion-props-widget.component.html',
})
export class AccordionPropsWidgetComponent {
  readonly title = input<string>('');
  readonly content = input<string>('');
  readonly changed = output<AccordionPropsChange>();
}
