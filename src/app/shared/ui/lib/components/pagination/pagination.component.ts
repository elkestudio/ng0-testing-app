import {
  Component,
  input,
  model,
  output,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { PaginationSize } from './pagination.types';

@Component({
  selector: 'ng0-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
})
export class Ng0PaginationComponent {
  readonly totalPages = input.required<number>();
  readonly currentPage = model<number>(1);
  readonly size = input<PaginationSize>('md');
  readonly maxVisiblePages = input<number>(5);

  readonly pageChange = output<number>();

  protected readonly pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const max = this.maxVisiblePages();

    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | '...')[] = [];
    const half = Math.floor(max / 2);
    let start = Math.max(2, current - half);
    let end = Math.min(total - 1, current + half);

    if (current <= half + 1) {
      end = max - 1;
    }
    if (current >= total - half) {
      start = total - max + 2;
    }

    pages.push(1);
    if (start > 2) pages.push('...');
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < total - 1) pages.push('...');
    if (total > 1) pages.push(total);

    return pages;
  });

  protected readonly sizeClasses = computed(() => {
    const sizes: Record<PaginationSize, string> = {
      sm: 'h-7 min-w-7 text-xs',
      md: 'h-9 min-w-9 text-sm',
      lg: 'h-11 min-w-11 text-base',
    };
    return sizes[this.size()];
  });

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage()) return;
    this.currentPage.set(page);
    this.pageChange.emit(page);
  }

  protected prev(): void {
    this.goToPage(this.currentPage() - 1);
  }

  protected next(): void {
    this.goToPage(this.currentPage() + 1);
  }
}
