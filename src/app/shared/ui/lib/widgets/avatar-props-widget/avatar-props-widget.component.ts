import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { WidgetButtonGroupComponent, WidgetSelectComponent, WidgetRowComponent, WidgetTextComponent, SIZE_OPTIONS_5, SHAPE_OPTIONS_AVATAR } from '../widget-controls/index';
import type { AvatarPropsChange } from '../widget-prop-types';

@Component({
  selector: 'ng0-avatar-props-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WidgetRowComponent, WidgetButtonGroupComponent, WidgetSelectComponent, WidgetTextComponent],
  templateUrl: './avatar-props-widget.component.html',
})
export class AvatarPropsWidgetComponent {
  readonly src = input<string>('');
  readonly name = input<string>('');
  readonly size = input<string>('md');
  readonly shape = input<string>('circle');
  readonly changed = output<AvatarPropsChange>();

  protected readonly sizeOptions = SIZE_OPTIONS_5;

  protected readonly shapeOptions = SHAPE_OPTIONS_AVATAR;
}
