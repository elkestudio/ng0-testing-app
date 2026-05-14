import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
} from '@angular/core';
import {
  SpacingToken,
  SPACING_MAP,
  ContainerSize,
  CONTAINER_SIZE_MAP,
} from '../layout.types.js';

@Component({
  selector: 'ng0-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': '"block"',
    '[style.width]': '"100%"',
    '[style.max-width]': 'maxWidthValue()',
    '[style.margin-inline]': 'center() ? "auto" : null',
    '[style.padding]': 'paddingValue()',
  },
  templateUrl: './container.component.html',
})
export class Ng0ContainerComponent {
  readonly maxWidth = input<ContainerSize>('full');
  readonly padding = input<SpacingToken>('none');

  readonly center = input(true, {
    transform: (v: boolean | string) =>
      typeof v === 'string' ? v === '' || v === 'true' : v,
  });

  protected maxWidthValue = computed(() => CONTAINER_SIZE_MAP[this.maxWidth()]);
  protected paddingValue = computed(() => SPACING_MAP[this.padding()]);
}
