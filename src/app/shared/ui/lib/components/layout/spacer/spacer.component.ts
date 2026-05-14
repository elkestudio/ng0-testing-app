import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import { SpacingToken, SPACING_MAP } from '../layout.types.js';

@Component({
  selector: 'ng0-spacer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.flex]': 'size() ? "0 0 auto" : "1 1 0%"',
    '[style.width]': 'sizeValue()',
    '[style.height]': 'sizeValue()',
  },
  templateUrl: './spacer.component.html',
})
export class Ng0SpacerComponent {
  readonly size = input<SpacingToken | undefined>(undefined);

  protected sizeValue = computed(() => {
    const s = this.size();
    return s ? SPACING_MAP[s] : null;
  });
}
