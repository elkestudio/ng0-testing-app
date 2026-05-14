export interface BreadcrumbItem {
  label: string;
  routerLink?: string | string[];
  href?: string;
}

export type BreadcrumbSeparator = 'slash' | 'chevron' | 'arrow' | 'dot';
