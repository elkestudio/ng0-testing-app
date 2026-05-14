import {
  Component,
  input,
  model,
  output,
  computed,
  ChangeDetectionStrategy,
  contentChildren,
  AfterContentInit,
} from '@angular/core';
import { Ng0IconComponent } from '../icon/icon.component';

export type TabVariant = 'line' | 'enclosed' | 'pills';

@Component({
  selector: 'ng0-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tab.component.html',
})
export class Ng0TabComponent {
  readonly tabId = input.required<string>({ alias: 'id' });
  readonly label = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly icon = input<string>();

  isActive = model<boolean>(false);
}

@Component({
  selector: 'ng0-tabs',
  imports: [Ng0IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tabs.component.html',
})
export class Ng0TabsComponent implements AfterContentInit {
  readonly variant = input<TabVariant>('line');
  readonly activeTab = model<string>('');
  readonly tabChange = output<string>();

  readonly tabs = contentChildren(Ng0TabComponent);

  ngAfterContentInit(): void {
    const tabList = this.tabs();
    if (!this.activeTab() && tabList.length > 0) {
      const firstEnabled = tabList.find(t => !t.disabled());
      if (firstEnabled) {
        this.selectTab(firstEnabled.tabId());
      }
    } else {
      this.updateTabStates();
    }
  }

  selectTab(id: string): void {
    this.activeTab.set(id);
    this.tabChange.emit(id);
    this.updateTabStates();
  }

  private updateTabStates(): void {
    const active = this.activeTab();
    this.tabs().forEach(tab => tab.isActive.set(tab.tabId() === active));
  }

  protected tabClasses = computed(() => {
    return (tabId: string) => {
      const isActive = tabId === this.activeTab();
      const base = 'px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none flex items-center gap-1.5';
      const activeClass = isActive
        ? 'text-primary border-b-2 border-primary -mb-px'
        : 'text-base-content/60 hover:text-base-content';
      const disabledClass = 'disabled:opacity-40 disabled:cursor-not-allowed';
      return `${base} ${activeClass} ${disabledClass}`;
    };
  });
}
