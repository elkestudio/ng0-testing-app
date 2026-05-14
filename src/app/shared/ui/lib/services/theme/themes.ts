import { defineTheme } from './theme.types';

/** Built-in light theme */
export const LIGHT_THEME = defineTheme({ name: 'light', isDark: false });

/** Built-in dark theme */
export const DARK_THEME = defineTheme({ name: 'dark', isDark: true });
