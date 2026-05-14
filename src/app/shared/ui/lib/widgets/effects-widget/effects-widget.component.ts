import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface EffectsChange {
  boxShadow?: string;
  shadowOffsetX?: string;
  shadowOffsetY?: string;
  shadowBlur?: string;
  shadowSpread?: string;
  shadowColor?: string;
}

@Component({
  selector: 'ng0-effects-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './effects-widget.component.html',
})
export class EffectsWidgetComponent {
  readonly shadowOffsetX = input<string>('0');
  readonly shadowOffsetY = input<string>('0');
  readonly shadowBlur = input<string>('0');
  readonly shadowSpread = input<string>('0');
  readonly shadowColor = input<string>('');

  readonly changed = output<EffectsChange>();

  protected onFieldChange(field: string, value: string): void {
    this.changed.emit({ [field]: value });
    this.emitBoxShadow(field, value);
  }

  private emitBoxShadow(changedField: string, newValue: string): void {
    const x = changedField === 'shadowOffsetX' ? newValue : this.shadowOffsetX();
    const y = changedField === 'shadowOffsetY' ? newValue : this.shadowOffsetY();
    const blur = changedField === 'shadowBlur' ? newValue : this.shadowBlur();
    const spread = changedField === 'shadowSpread' ? newValue : this.shadowSpread();
    const color = changedField === 'shadowColor' ? newValue : this.shadowColor();

    if (!color && !x && !y && !blur && !spread) {
      this.changed.emit({ boxShadow: 'none' });
      return;
    }

    const xVal = x || '0px';
    const yVal = y || '0px';
    const blurVal = blur || '0px';
    const spreadVal = spread || '0px';
    const colorVal = color || 'rgba(0,0,0,0.25)';
    this.changed.emit({ boxShadow: `${xVal} ${yVal} ${blurVal} ${spreadVal} ${colorVal}` });
  }
}
