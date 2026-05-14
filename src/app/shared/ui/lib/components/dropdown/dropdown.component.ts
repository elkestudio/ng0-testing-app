import {
  Component,
  ContentChild,
  ElementRef,
  inject,
  input,
  OnDestroy,
  AfterContentInit,
  Renderer2,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Ng0DropdownTriggerDirective } from './dropdown-trigger.directive';
import { Ng0DropdownMenuComponent } from './dropdown-menu.component';
import { PopoverService, PopoverRef } from '../../services/popover/popover.service';
import { DropdownPosition } from './dropdown.types';

@Component({
  selector: 'ng0-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host { display: inline-block; position: relative; }`],
})
export class Ng0DropdownComponent implements AfterContentInit, OnDestroy {
  readonly position = input<DropdownPosition>('bottom');
  readonly hover = input(false);
  readonly backdropClass = input<string | undefined>(undefined);

  @ContentChild(Ng0DropdownTriggerDirective) trigger!: Ng0DropdownTriggerDirective;
  @ContentChild(Ng0DropdownMenuComponent) menu!: Ng0DropdownMenuComponent;

  private readonly popoverService = inject(PopoverService);
  private readonly renderer = inject(Renderer2);
  private readonly elementRef = inject(ElementRef);
  private overlayRef: PopoverRef | null = null;
  private isOpen = false;
  private hoverTimeout: ReturnType<typeof setTimeout> | null = null;

  ngAfterContentInit(): void {
    if (!this.trigger) return;
    const triggerEl = this.trigger.elementRef.nativeElement;
    this.renderer.listen(triggerEl, 'click', () => { if (!this.hover()) this.toggle(); });
    if (this.hover()) {
      this.renderer.listen(this.elementRef.nativeElement, 'mouseenter', () => this.onMouseEnter());
      this.renderer.listen(this.elementRef.nativeElement, 'mouseleave', () => this.onMouseLeave());
    }
  }

  toggle(): void { this.isOpen ? this.close() : this.open(); }

  open(): void {
    if (this.isOpen || !this.menu || !this.trigger) return;
    const menuEl = this.menu.nativeElement;
    const triggerEl = this.trigger.elementRef.nativeElement;
    this.renderer.addClass(menuEl, 'bg-base-100');
    this.renderer.addClass(menuEl, 'border');
    this.renderer.addClass(menuEl, 'border-base-300');
    this.renderer.addClass(menuEl, 'rounded-xl');
    this.renderer.addClass(menuEl, 'shadow-xl');
    this.renderer.addClass(menuEl, 'overflow-hidden');
    this.renderer.setStyle(menuEl, 'min-width', '12rem');
    this.overlayRef = this.popoverService.open(menuEl, {
      triggerElement: triggerEl,
      position: this.position(),
      offsetY: 8,
      backdropClass: this.backdropClass(),
      onClose: () => { this.isOpen = false; this.overlayRef = null; },
    });
    this.isOpen = true;
  }

  close(): void {
    this.overlayRef?.close();
    this.overlayRef = null;
    this.isOpen = false;
  }

  private onMouseEnter(): void {
    if (this.hoverTimeout) clearTimeout(this.hoverTimeout);
    if (!this.isOpen) this.open();
  }

  private onMouseLeave(): void {
    this.hoverTimeout = setTimeout(() => this.close(), 200);
  }

  ngOnDestroy(): void { this.close(); }
}
