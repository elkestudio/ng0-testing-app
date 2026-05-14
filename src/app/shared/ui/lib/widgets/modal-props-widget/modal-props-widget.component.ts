import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetRowComponent, WidgetTextComponent, WidgetButtonGroupComponent, BOOL_OPTIONS } from '../widget-controls/index';

export interface ModalPropsChange { title?: string; open?: boolean; }

@Component({
  selector: 'ng0-modal-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetTextComponent, WidgetButtonGroupComponent],
  templateUrl: './modal-props-widget.component.html',
})
export class ModalPropsWidgetComponent {
  readonly title = input<string>('');
  readonly open = input<boolean>(false);
  readonly changed = output<ModalPropsChange>();

  protected readonly boolOptions = BOOL_OPTIONS;
}
