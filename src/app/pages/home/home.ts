import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Ng0ButtonComponent, Ng0ContentComponent, Ng0DockComponent, Ng0HeaderComponent, Ng0IconComponent, Ng0TextComponent } from '@ng0/ui';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, Ng0ButtonComponent, Ng0ContentComponent, Ng0DockComponent, Ng0HeaderComponent, Ng0IconComponent, Ng0TextComponent],
  templateUrl: './home.ng.html'})
export class HomeComponent {
protected readonly router = inject(Router);
  protected readonly loading = signal(true);
  protected readonly username = signal("pera");
  protected readonly increment = signal(0);
  protected readonly show = signal(true);

  protected on_click_el_mp5tgyt0_4(_event?: Event): void {
    this.router.navigate(["/about-us"]);
  }

  protected increment2(value: unknown): void {
    /* TODO: visual function body — translate from editor graph */
  }
}
