/**
 * Layout primitive types — shared across all layout components.
 *
 * Spacing tokens resolve to `var(--spacing-*)` CSS custom properties
 * defined in theme-bridge.css, themeable per-app.
 */

// ── Spacing ────────────────────────────────────────────────────────────────

export type SpacingToken =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl';

export const SPACING_MAP: Record<SpacingToken, string> = {
  none: '0',
  xs: 'var(--spacing-xs)',
  sm: 'var(--spacing-sm)',
  md: 'var(--spacing-md)',
  lg: 'var(--spacing-lg)',
  xl: 'var(--spacing-xl)',
  '2xl': 'var(--spacing-2xl)',
  '3xl': 'var(--spacing-3xl)',
};

// ── Alignment ──────────────────────────────────────────────────────────────

export type CrossAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

export const CROSS_ALIGN_MAP: Record<CrossAlign, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  baseline: 'baseline',
};

// ── Justification ──────────────────────────────────────────────────────────

export type MainJustify =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly';

export const MAIN_JUSTIFY_MAP: Record<MainJustify, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
  evenly: 'space-evenly',
};

// ── Container ──────────────────────────────────────────────────────────────

export type ContainerSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | 'full'
  | 'prose';

export const CONTAINER_SIZE_MAP: Record<ContainerSize, string> = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
  prose: '65ch',
};
