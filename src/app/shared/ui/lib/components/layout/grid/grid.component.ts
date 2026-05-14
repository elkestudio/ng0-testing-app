import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { NgStyle } from '@angular/common';

export type GridLayoutMode = 'fixed' | 'fluid';

@Component({
  selector: 'ng0-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grid.component.html',
  imports: [NgStyle],
})
export class GridComponent {
  readonly columns = input<number>(2);
  readonly rows = input<number | null>(null);
  readonly gap = input<string>('8px');
  readonly rowGap = input<string | null>(null);
  readonly colGap = input<string | null>(null);
  readonly minChildWidth = input<string | null>(null);
  readonly mode = input<GridLayoutMode>('fixed');
  readonly padding = input<string>('0');
  readonly editing = input<boolean>(false);

  readonly cellClick = output<number>();

  protected readonly gridStyle = computed(() => {
    const cols = this.columns();
    const min = this.minChildWidth();
    const mode = this.mode();
    const colsValue = mode === 'fluid' && min
      ? `repeat(auto-fill, minmax(${min}, 1fr))`
      : `repeat(${cols}, 1fr)`;

    return {
      display: 'grid',
      gridTemplateColumns: colsValue,
      gap: this.rowGap() || this.colGap()
        ? `${this.rowGap() ?? this.gap()} ${this.colGap() ?? this.gap()}`
        : this.gap(),
      padding: this.padding(),
      ...(this.rows() ? { gridTemplateRows: `repeat(${this.rows()}, 1fr)` } : {}),
    };
  });

  protected readonly cellCount = computed(() => {
    const c = this.columns();
    const r = this.rows();
    return r ? c * r : c;
  });

  protected readonly cells = computed(() =>
    Array.from({ length: this.cellCount() }, (_, i) => i)
  );
}
