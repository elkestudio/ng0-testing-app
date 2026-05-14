import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ng0-widget-number',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './widget-number.component.html',
})
export class WidgetNumberComponent {
  readonly value = input<number>(0);
  readonly min = input<number>(0);
  readonly max = input<number>(100);
  readonly step = input<number>(1);
  readonly label = input<string>('');
  readonly showSlider = input<boolean>(false);
  readonly valueChange = output<number>();

  protected onChange(value: number): void {
    this.valueChange.emit(value);
  }
}
