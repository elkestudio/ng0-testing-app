import {
  Component,
  ViewChild,
  ViewContainerRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Ng0IconComponent } from '../../components/icon/icon.component';

@Component({
  selector: 'ng0-drawer-container',
  standalone: true,
  imports: [Ng0IconComponent],
  templateUrl: './drawer-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ng0-drawer-container' },
})
export class DrawerContainerComponent {
  @ViewChild('contentHost', { read: ViewContainerRef, static: true })
  contentHost!: ViewContainerRef;

  title?: string;
  showClose = true;
  sizeClass = 'w-80';
  cssClass = '';
  closeHandler?: () => void;

  onCloseClick(): void {
    this.closeHandler?.();
  }
}
