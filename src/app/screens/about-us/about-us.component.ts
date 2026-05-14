import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Ng0ContentComponent, Ng0DockComponent } from '@ng0/ui';

@Component({
  selector: 'app-about-us',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, Ng0ContentComponent, Ng0DockComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'})
export class AboutUsComponent {
  /* no signals */

  /* no event handlers */

  /* no functions */
}
