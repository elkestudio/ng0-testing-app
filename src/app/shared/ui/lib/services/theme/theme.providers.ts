import {
  Provider,
  EnvironmentProviders,
  provideAppInitializer,
  inject,
  InjectionToken,
} from '@angular/core';
import { ThemeStore } from './theme.store';
import { ThemeDefinition } from './theme.types';
import { LIGHT_THEME, DARK_THEME } from './themes';

/**
 * Configuration options for theme provider.
 *
 * `provideTheme()` is the single source of truth for theme behavior.
 * CSS files stay as pure design tokens. All dark detection, system preference
 * mapping, and available themes are derived from this config.
 */
export interface ThemeConfig {
  /**
   * Available themes. Order matters — first is the fallback.
   * If omitted → [LIGHT_THEME, DARK_THEME]
   */
  themes?: ThemeDefinition[];

  /**
   * Default theme preference when no saved preference exists.
   * - 'system' → resolves via prefers-color-scheme (default)
   * - A ThemeDefinition → locked to that theme
   */
  defaultTheme?: 'system' | ThemeDefinition;

  /**
   * Which theme to use when system prefers dark.
   * Must be one of the themes array.
   * If omitted → first theme where isDark === true, or first theme.
   */
  prefersDark?: ThemeDefinition;

  /**
   * Which theme to use when system prefers light.
   * If omitted → first theme where isDark === false, or first theme.
   */
  prefersLight?: ThemeDefinition;
}

/**
 * Injection token for theme config
 */
export const THEME_CONFIG = new InjectionToken<ThemeConfig>('THEME_CONFIG');

/**
 * Provide theme management for the application.
 *
 * @example
 * ```ts
 * // Minimal — zero config, gets light/dark
 * provideTheme()
 *
 * // App with custom themes
 * provideTheme({
 *   themes: [NG0_LIGHT, NG0_MEDIUM, NG0_DARK],
 *   prefersDark: NG0_DARK,
 *   prefersLight: NG0_LIGHT,
 * })
 *
 * // Locked to single theme
 * provideTheme({
 *   themes: [CORPORATE],
 *   defaultTheme: CORPORATE,
 * })
 * ```
 */
export function provideTheme(
  config?: ThemeConfig,
): (Provider | EnvironmentProviders)[] {
  const resolvedConfig: ThemeConfig = {
    themes: [LIGHT_THEME, DARK_THEME],
    defaultTheme: 'system',
    ...config,
  };

  return [
    { provide: THEME_CONFIG, useValue: resolvedConfig },
    ThemeStore,
    provideAppInitializer(() => {
      const themeStore = inject(ThemeStore);
      themeStore.initialize();
    }),
  ];
}
