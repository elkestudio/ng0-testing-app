import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetNumberComponent, WidgetRowComponent, WidgetTextComponent } from '../widget-controls/index';

export interface TextareaPropsChange { placeholder?: string; rows?: number; }

@Component({
  selector: 'ng0-textarea-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetNumberComponent, WidgetTextComponent],
  templateUrl: './textarea-props-widget.component.html',
})
export class TextareaPropsWidgetComponent {
  readonly placeholder = input<string>('');
  readonly rows = input<number>(4);
  readonly changed = output<TextareaPropsChange>();
}
