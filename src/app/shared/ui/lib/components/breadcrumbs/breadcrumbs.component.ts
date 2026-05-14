import {
  Component,
  input,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { BreadcrumbItem, BreadcrumbSeparator } from './breadcrumbs.types';

@Component({
  selector: 'ng0-breadcrumbs',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './breadcrumbs.component.html',
})
export class Ng0BreadcrumbsComponent {
  readonly items = input<BreadcrumbItem[]>([]);
  readonly separator = input<BreadcrumbSeparator>('chevron');

  protected readonly separatorChar = computed(() => {
    const separators: Record<BreadcrumbSeparator, string> = {
      slash: '/',
      chevron: '›',
      arrow: '→',
      dot: '·',
    };
    return separators[this.separator()];
  });
}
