import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Ng0ButtonComponent, Ng0ContentComponent, Ng0DockComponent, Ng0HeaderComponent, Ng0IconComponent, Ng0StackComponent, Ng0TextComponent } from '@ng0/ui';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, Ng0ButtonComponent, Ng0ContentComponent, Ng0DockComponent, Ng0HeaderComponent, Ng0IconComponent, Ng0StackComponent, Ng0TextComponent],
  templateUrl: './home.ng.html'})
export class HomeComponent {
  /* no signals */

  /* no event handlers */

  /* no functions */
}
