import type { WidgetSelectOption } from './widget-select.component';
import type { ButtonGroupOption } from './widget-button-group.component';

/* ── Size options ─────────────────────────────────────── */

/** xs · sm · md · lg — used by button, input */
export const SIZE_OPTIONS_4: ButtonGroupOption[] = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
];

/** sm · md · lg — used by badge */
export const SIZE_OPTIONS_3: ButtonGroupOption[] = [
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
];

/** xs · sm · md · lg · xl — used by avatar */
export const SIZE_OPTIONS_5: ButtonGroupOption[] = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'SM' },
  { value: 'md', label: 'MD' },
  { value: 'lg', label: 'LG' },
  { value: 'xl', label: 'XL' },
];

/* ── Shape options ────────────────────────────────────── */

/** rounded · pill · square · circle — used by button */
export const SHAPE_OPTIONS_BUTTON: WidgetSelectOption[] = [
  { value: 'rounded', label: 'Rounded' },
  { value: 'pill', label: 'Pill' },
  { value: 'square', label: 'Square' },
  { value: 'circle', label: 'Circle' },
];

/** square · rounded · xl — used by card */
export const SHAPE_OPTIONS_CARD: WidgetSelectOption[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'xl', label: 'XL' },
];

/** circle · rounded · square — used by avatar */
export const SHAPE_OPTIONS_AVATAR: WidgetSelectOption[] = [
  { value: 'circle', label: 'Circle' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'square', label: 'Square' },
];

/* ── Boolean toggle options ───────────────────────────── */

/** Generic yes/no toggle for boolean props */
export const BOOL_OPTIONS: ButtonGroupOption[] = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
];

/** Bordered toggle with icons */
export const BORDERED_OPTIONS: ButtonGroupOption[] = [
  { value: 'true', label: 'Yes', icon: 'border_all' },
  { value: 'false', label: 'No', icon: 'border_clear' },
];

/* ── Width preset options ──────────────────────────────── */

/** Width presets — used by button */
export const WIDTH_PRESET_OPTIONS: ButtonGroupOption[] = [
  { value: 'fit', label: 'Fit' },
  { value: '1/4', label: '1/4' },
  { value: '1/3', label: '1/3' },
  { value: '1/2', label: '1/2' },
  { value: 'full', label: 'Full' },
];

/* ── Color options ────────────────────────────────────── */

/** Theme color options — used by progress, slider */
export const COLOR_OPTIONS: WidgetSelectOption[] = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'accent', label: 'Accent' },
  { value: 'success', label: 'Success' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
];
