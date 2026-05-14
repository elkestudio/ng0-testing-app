import { Injectable, signal } from '@angular/core';

export interface ContextMenuItem {
  label: string;
  icon?: string;
  danger?: boolean;
  disabled?: boolean;
  action: () => void;
}

export interface ContextMenuConfig {
  x: number;
  y: number;
  items: ContextMenuItem[];
}

export interface OverlayConfig {
  triggerElement: HTMLElement;
  position?: 'bottom' | 'top' | 'left' | 'right';
  offsetY?: number;
  offsetX?: number;
  matchWidth?: boolean;
  backdropClass?: string;
  onClose?: () => void;
}

export interface OverlayRef {
  close: () => void;
  updatePosition: () => void;
}

@Injectable({ providedIn: 'root' })
export class OverlayService {
  // ── Context menu (signal-based, used by Ng0ContextMenuComponent) ────────
  readonly contextMenu = signal<ContextMenuConfig | null>(null);

  openContextMenu(config: ContextMenuConfig): void {
    this.contextMenu.set(config);
  }

  closeContextMenu(): void {
    this.contextMenu.set(null);
  }

  // ── Overlay host ─────────────────────────────────────────────────────────
  private overlayHost: HTMLElement | null = null;

  getOverlayHost(): HTMLElement {
    if (!this.overlayHost) {
      this.overlayHost = document.createElement('div');
      this.overlayHost.id = 'ng0-overlay-host';
      this.overlayHost.style.cssText =
        'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999999;';
      document.body.appendChild(this.overlayHost);
    }
    return this.overlayHost;
  }

  // ── Animation styles ─────────────────────────────────────────────────────
  private stylesInjected = false;

  injectAnimationStyles(): void {
    if (this.stylesInjected) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'ng0-overlay-animation-styles';
    styleEl.textContent = `
      @keyframes ng0OverlayEnter {
        from { opacity: 0; transform: scale(0.95) translateY(-6px); }
        to   { opacity: 1; transform: scale(1) translateY(0); }
      }
      @keyframes ng0OverlayExit {
        from { opacity: 1; transform: scale(1) translateY(0); }
        to   { opacity: 0; transform: scale(0.95) translateY(-6px); }
      }
      .ng0-overlay-enter {
        animation: ng0OverlayEnter var(--ng0-overlay-enter-duration, 0.18s)
          var(--ng0-overlay-enter-easing, cubic-bezier(0.16,1,0.3,1)) forwards;
        transform-origin: top center;
      }
      .ng0-overlay-exit {
        animation: ng0OverlayExit var(--ng0-overlay-exit-duration, 0.14s)
          var(--ng0-overlay-exit-easing, cubic-bezier(0.16,1,0.3,1)) forwards;
        transform-origin: top center;
      }

      /* Drawer slide animations */
      @keyframes ng0DrawerBackdropEnter { from { opacity: 0; } to { opacity: 1; } }
      @keyframes ng0DrawerBackdropExit  { from { opacity: 1; } to { opacity: 0; } }
      @keyframes ng0DrawerSlideInLeft   { from { transform: translateX(-100%); } to { transform: translateX(0); } }
      @keyframes ng0DrawerSlideOutLeft  { from { transform: translateX(0); } to { transform: translateX(-100%); } }
      @keyframes ng0DrawerSlideInRight  { from { transform: translateX(100%);  } to { transform: translateX(0); } }
      @keyframes ng0DrawerSlideOutRight { from { transform: translateX(0); } to { transform: translateX(100%); } }
      @keyframes ng0DrawerSlideInTop    { from { transform: translateY(-100%); } to { transform: translateY(0); } }
      @keyframes ng0DrawerSlideOutTop   { from { transform: translateY(0); } to { transform: translateY(-100%); } }
      @keyframes ng0DrawerSlideInBottom { from { transform: translateY(100%);  } to { transform: translateY(0); } }
      @keyframes ng0DrawerSlideOutBottom{ from { transform: translateY(0); } to { transform: translateY(100%); } }

      .ng0-drawer-backdrop-enter { animation: ng0DrawerBackdropEnter var(--ng0-drawer-enter-duration,0.28s) ease forwards; }
      .ng0-drawer-backdrop-exit  { animation: ng0DrawerBackdropExit  var(--ng0-drawer-exit-duration, 0.22s) ease forwards; }
      .ng0-drawer-slide-in-left  { animation: ng0DrawerSlideInLeft   var(--ng0-drawer-enter-duration,0.28s) var(--ng0-drawer-enter-easing,cubic-bezier(0.16,1,0.3,1)) forwards; }
      .ng0-drawer-slide-out-left { animation: ng0DrawerSlideOutLeft  var(--ng0-drawer-exit-duration, 0.22s) var(--ng0-drawer-exit-easing,cubic-bezier(0.16,1,0.3,1)) forwards; }
      .ng0-drawer-slide-in-right { animation: ng0DrawerSlideInRight  var(--ng0-drawer-enter-duration,0.28s) var(--ng0-drawer-enter-easing,cubic-bezier(0.16,1,0.3,1)) forwards; }
      .ng0-drawer-slide-out-right{ animation: ng0DrawerSlideOutRight var(--ng0-drawer-exit-duration, 0.22s) var(--ng0-drawer-exit-easing,cubic-bezier(0.16,1,0.3,1)) forwards; }
      .ng0-drawer-slide-in-top   { animation: ng0DrawerSlideInTop    var(--ng0-drawer-enter-duration,0.28s) var(--ng0-drawer-enter-easing,cubic-bezier(0.16,1,0.3,1)) forwards; }
      .ng0-drawer-slide-out-top  { animation: ng0DrawerSlideOutTop   var(--ng0-drawer-exit-duration, 0.22s) var(--ng0-drawer-exit-easing,cubic-bezier(0.16,1,0.3,1)) forwards; }
      .ng0-drawer-slide-in-bottom{ animation: ng0DrawerSlideInBottom var(--ng0-drawer-enter-duration,0.28s) var(--ng0-drawer-enter-easing,cubic-bezier(0.16,1,0.3,1)) forwards; }
      .ng0-drawer-slide-out-bottom{animation: ng0DrawerSlideOutBottom var(--ng0-drawer-exit-duration, 0.22s) var(--ng0-drawer-exit-easing,cubic-bezier(0.16,1,0.3,1)) forwards; }
    `;
    document.head.appendChild(styleEl);
    this.stylesInjected = true;
  }

  // ── Imperative positioned overlay ────────────────────────────────────────
  private currentOverlayRef: OverlayRef | null = null;
  private currentBackdrop: HTMLElement | null = null;

  open(content: HTMLElement, config: OverlayConfig): OverlayRef {
    this.closeAll();
    this.injectAnimationStyles();

    const host = this.getOverlayHost();

    if (config.backdropClass) {
      const backdrop = document.createElement('div');
      backdrop.className = config.backdropClass;
      backdrop.style.cssText =
        'position: fixed; inset: 0; pointer-events: auto; z-index: 0;';
      backdrop.addEventListener('click', () => close());
      host.appendChild(backdrop);
      this.currentBackdrop = backdrop;
    }

    const overlayWrapper = document.createElement('div');
    overlayWrapper.className = 'ng0-overlay-wrapper ng0-overlay-enter';
    overlayWrapper.style.cssText =
      'position: absolute; pointer-events: auto; z-index: 10;';
    overlayWrapper.appendChild(content);
    host.appendChild(overlayWrapper);

    const updatePosition = () => {
      const rect = config.triggerElement.getBoundingClientRect();
      const offsetY = config.offsetY ?? 4;
      const offsetX = config.offsetX ?? 0;
      let top: number;
      let left: number;

      switch (config.position ?? 'bottom') {
        case 'top':
          top = rect.top - overlayWrapper.offsetHeight - offsetY;
          left = rect.left + offsetX;
          break;
        case 'left':
          top = rect.top + offsetY;
          left = rect.left - overlayWrapper.offsetWidth - offsetX;
          break;
        case 'right':
          top = rect.top + offsetY;
          left = rect.right + offsetX;
          break;
        case 'bottom':
        default:
          top = rect.bottom + offsetY;
          left = rect.left + offsetX;
          break;
      }

      overlayWrapper.style.top = `${top}px`;
      overlayWrapper.style.left = `${left}px`;
      if (config.matchWidth) {
        overlayWrapper.style.width = `${rect.width}px`;
      }
    };

    updatePosition();

    const close = () => {
      overlayWrapper.classList.remove('ng0-overlay-enter');
      overlayWrapper.classList.add('ng0-overlay-exit');

      const removeElements = () => {
        overlayWrapper.remove();
        if (this.currentBackdrop) {
          this.currentBackdrop.remove();
          this.currentBackdrop = null;
        }
        if (config.onClose) config.onClose();
        this.currentOverlayRef = null;
      };

      overlayWrapper.addEventListener('animationend', removeElements, { once: true });
      setTimeout(() => {
        if (overlayWrapper.parentNode) removeElements();
      }, 200);
    };

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (overlayWrapper.contains(target) || config.triggerElement.contains(target)) return;
      if (!config.backdropClass) {
        close();
        document.removeEventListener('click', handleDocumentClick, true);
      }
    };

    if (!config.backdropClass) {
      setTimeout(() => document.addEventListener('click', handleDocumentClick, true), 0);
    }

    const overlayRef: OverlayRef = {
      close: () => {
        if (!config.backdropClass) {
          document.removeEventListener('click', handleDocumentClick, true);
        }
        close();
      },
      updatePosition,
    };

    this.currentOverlayRef = overlayRef;
    return overlayRef;
  }

  closeAll(): void {
    if (this.currentOverlayRef) {
      this.currentOverlayRef.close();
    }
    if (this.overlayHost && this.overlayHost.hasChildNodes()) {
      this.overlayHost.innerHTML = '';
      this.currentOverlayRef = null;
      this.currentBackdrop = null;
    }
  }
}
