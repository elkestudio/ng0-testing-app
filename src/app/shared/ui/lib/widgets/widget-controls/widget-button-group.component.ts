import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

export interface ButtonGroupOption {
  value: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'ng0-widget-button-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './widget-button-group.component.html',
})
export class WidgetButtonGroupComponent {
  readonly options = input.required<ButtonGroupOption[]>();
  readonly value = input<string>('');
  readonly valueChange = output<string>();

  protected select(value: string): void {
    this.valueChange.emit(value);
  }
}
