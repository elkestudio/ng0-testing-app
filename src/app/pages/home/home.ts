import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Ng0ButtonComponent, Ng0ChipComponent, Ng0ContentComponent, Ng0DockComponent, Ng0HeaderComponent, Ng0IconComponent, Ng0InputComponent, Ng0TextComponent } from '@ng0/ui';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, Ng0ButtonComponent, Ng0ChipComponent, Ng0ContentComponent, Ng0DockComponent, Ng0HeaderComponent, Ng0IconComponent, Ng0InputComponent, Ng0TextComponent],
  templateUrl: './home.ng.html'})
export class HomeComponent {
  protected readonly loading = signal(true);
  protected readonly username = signal("pera");
  protected readonly increment = signal(0);
  protected readonly show = signal(true);

  /* no event handlers */

  protected increment2(value: unknown): void {
    /* TODO: visual function body — translate from editor graph */
  }
}
