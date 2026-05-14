import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export type AlignValue = 'flex-start' | 'center' | 'flex-end' | 'stretch';
export type JustifyValue = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
export type DirectionValue = 'row' | 'column';
export type WrapValue = 'nowrap' | 'wrap';

export interface LayoutChange {
  justifyContent?: JustifyValue;
  alignItems?: AlignValue;
  flexDirection?: DirectionValue;
  flexWrap?: WrapValue;
  gap?: string;
}

@Component({
  selector: 'ng0-layout-widget',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './layout-widget.component.html',
})
export class LayoutWidgetComponent {
  readonly justifyContent = input<string>('flex-start');
  readonly alignItems = input<string>('stretch');
  readonly flexDirection = input<string>('column');
  readonly flexWrap = input<string>('nowrap');
  readonly gap = input<string>('');

  readonly changed = output<LayoutChange>();

  protected readonly isRow = computed(() => this.flexDirection() === 'row');

  // Direction-aware icons for justify (main axis)
  protected readonly justifyButtons = computed(() => {
    const row = this.isRow();
    return [
      { value: 'flex-start' as JustifyValue, icon: row ? 'format_align_left' : 'vertical_align_top', label: 'Start' },
      { value: 'center' as JustifyValue, icon: row ? 'format_align_center' : 'vertical_align_center', label: 'Center' },
      { value: 'flex-end' as JustifyValue, icon: row ? 'format_align_right' : 'vertical_align_bottom', label: 'End' },
      { value: 'space-between' as JustifyValue, icon: row ? 'format_align_justify' : 'vertical_distribute', label: 'Space between' },
    ];
  });

  // Direction-aware icons for align (cross axis)
  protected readonly alignButtons = computed(() => {
    const row = this.isRow();
    return [
      { value: 'flex-start' as AlignValue, icon: row ? 'vertical_align_top' : 'format_align_left', label: 'Start' },
      { value: 'center' as AlignValue, icon: row ? 'vertical_align_center' : 'format_align_center', label: 'Center' },
      { value: 'flex-end' as AlignValue, icon: row ? 'vertical_align_bottom' : 'format_align_right', label: 'End' },
      { value: 'stretch' as AlignValue, icon: row ? 'expand' : 'swap_horiz', label: 'Stretch' },
    ];
  });

  protected setDirection(dir: DirectionValue): void {
    this.changed.emit({ flexDirection: dir });
  }

  protected setWrap(wrap: WrapValue): void {
    this.changed.emit({ flexWrap: wrap });
  }

  protected setJustify(value: JustifyValue): void {
    this.changed.emit({ justifyContent: value });
  }

  protected setAlign(value: AlignValue): void {
    this.changed.emit({ alignItems: value });
  }

  protected setGap(value: string): void {
    this.changed.emit({ gap: value });
  }
}
