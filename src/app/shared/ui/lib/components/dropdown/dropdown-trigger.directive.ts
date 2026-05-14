import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[ng0-dropdown-trigger]',
  standalone: true,
  exportAs: 'ng0DropdownTrigger',
})
export class Ng0DropdownTriggerDirective {
  readonly elementRef = inject(ElementRef);
}
