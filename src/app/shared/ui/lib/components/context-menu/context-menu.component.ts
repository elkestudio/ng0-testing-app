import {
  Component,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { Ng0IconComponent } from '../icon/icon.component';
import { OverlayService } from '../../services/overlay/overlay.service';

@Component({
  selector: 'ng0-context-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './context-menu.component.html',
  imports: [NgClass, Ng0IconComponent],
  host: {
    '(document:keydown.escape)': 'onEscape()',
  },
})
export class Ng0ContextMenuComponent {
  protected readonly overlay = inject(OverlayService);

  onEscape(): void {
    this.overlay.closeContextMenu();
  }
}
