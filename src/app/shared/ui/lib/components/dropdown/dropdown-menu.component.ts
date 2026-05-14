import { Component, ElementRef, inject, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'ng0-dropdown-menu',
  standalone: true,
  imports: [],
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host { display: block; }`],
})
export class Ng0DropdownMenuComponent {
  private readonly elementRef = inject(ElementRef);

  get nativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }
}
