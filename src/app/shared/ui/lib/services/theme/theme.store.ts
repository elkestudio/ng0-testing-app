import { inject, DOCUMENT } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { computed } from '@angular/core';
import { THEME_CONFIG } from './theme.providers';
import { ThemeDefinition } from './theme.types';
import { LIGHT_THEME, DARK_THEME } from './themes';

/**
 * Theme options available to users
 */
export type Theme = string | 'system';

/**
 * Resolved theme (actual applied theme, never 'system')
 */
export type ResolvedTheme = string;

export interface FavoriteTheme {
  name: string;
  variables: Record<string, string>;
}

interface ThemeState {
  /** User's theme preference */
  theme: Theme;
  /** The actual applied theme (resolved from 'system' if needed) */
  resolvedTheme: ResolvedTheme;
  /** Whether theme has been initialized from storage */
  initialized: boolean;
  /** Whether the current resolved theme is dark */
  isDark: boolean;
  /** Custom variable overrides */
  customVariables: Record<string, string>;
  /** List of available theme definitions */
  themes: ThemeDefinition[];
  /** User's favorite themes */
  favoriteThemes: FavoriteTheme[];
}

const STORAGE_KEY = 'ng0-theme';
const CUSTOM_VARS_KEY = 'ng0-theme-vars';
const FAVORITES_KEY = 'ng0-theme-favorites';

const initialState: ThemeState = {
  theme: 'system',
  resolvedTheme: 'light',
  initialized: false,
  isDark: false,
  customVariables: {},
  themes: [LIGHT_THEME, DARK_THEME],
  favoriteThemes: [],
};

export const ThemeStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ theme }) => ({
    /** Whether using system preference */
    isSystemTheme: computed(() => theme() === 'system'),
  })),
  withMethods((store) => {
    const document = inject(DOCUMENT);
    const config = inject(THEME_CONFIG, { optional: true });

    /** Resolved theme definitions from config or defaults */
    const getThemes = (): ThemeDefinition[] => {
      return config?.themes?.length ? config.themes : [LIGHT_THEME, DARK_THEME];
    };

    /**
     * Get the system's preferred color scheme, mapped to a theme name.
     */
    const getSystemTheme = (): ResolvedTheme => {
      if (typeof window === 'undefined') {
        const themes = getThemes();
        return (themes.find(t => t.isDark) || themes[0]).name;
      }

      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const themes = getThemes();

      if (systemIsDark) {
        const darkTheme = config?.prefersDark || themes.find(t => t.isDark);
        return (darkTheme || themes[0]).name;
      } else {
        const lightTheme = config?.prefersLight || themes.find(t => !t.isDark);
        return (lightTheme || themes[0]).name;
      }
    };

    /**
     * Resolve 'system' to actual theme.
     * Single theme in config → always that theme (locked, ignores system).
     */
    const resolveTheme = (theme: Theme): ResolvedTheme => {
      const themes = getThemes();

      // Single theme → locked
      if (themes.length === 1) return themes[0].name;

      // Non-system explicit selection
      if (theme !== 'system') return theme;

      // System preference resolution
      return getSystemTheme();
    };

    /** Look up isDark from ThemeDefinition */
    const isThemeDark = (themeName: string): boolean => {
      const themes = getThemes();
      const def = themes.find(t => t.name === themeName);
      return def?.isDark ?? false;
    };

    const applyVariables = (variables: Record<string, string>) => {
      const root = document.documentElement;
      Object.entries(variables).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    };

    /**
     * Apply theme using data-theme attribute on <html>
     */
    const applyTheme = (
      resolvedTheme: ResolvedTheme,
      customVars: Record<string, string> = {},
    ): void => {
      const root = document.documentElement;

      // Set data-theme attribute (synchronous — CSS updates immediately)
      root.setAttribute('data-theme', resolvedTheme);

      // Apply custom variable overrides
      applyVariables(customVars);

      // Determine darkness from typed config
      const dark = isThemeDark(resolvedTheme);
      patchState(store, { isDark: dark });

      // Keep theme-color meta in sync
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        const computedBase100 = getComputedStyle(root).getPropertyValue('--color-base-100').trim();
        if (computedBase100) {
          metaThemeColor.setAttribute('content', computedBase100);
        }
      }
    };

    /**
     * Listen for system theme changes (when theme is 'system')
     */
    const setupSystemThemeListener = (): void => {
      if (typeof window === 'undefined') return;

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', () => {
        if (store.theme() === 'system') {
          const resolved = resolveTheme('system');
          patchState(store, { resolvedTheme: resolved });
          applyTheme(resolved, store.customVariables());
        }
      });
    };

    /**
     * Load a value from localStorage safely
     */
    const loadFromStorage = (key: string): string | null => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    };

    /**
     * Save a value to localStorage safely
     */
    const saveToStorage = (key: string, value: string): void => {
      try {
        localStorage.setItem(key, value);
      } catch {
        // Storage full or unavailable — silently ignore
      }
    };

    return {
      /**
       * Initialize theme from stored preference (synchronous for localStorage)
       */
      initialize(): void {
        // Set themes from config
        const themes = getThemes();
        patchState(store, { themes });

        const savedThemeValue = loadFromStorage(STORAGE_KEY);
        const savedVarsValue = loadFromStorage(CUSTOM_VARS_KEY);
        const savedFavsValue = loadFromStorage(FAVORITES_KEY);

        let storedVars: Record<string, string> = {};
        if (savedVarsValue) {
          try {
            storedVars = JSON.parse(savedVarsValue);
          } catch {
            // Corrupted — ignore
          }
        }

        let favorites: FavoriteTheme[] = [];
        if (savedFavsValue) {
          try {
            favorites = JSON.parse(savedFavsValue);
          } catch {
            // Corrupted — ignore
          }
        }

        // Determine default theme from config
        const configDefault = config?.defaultTheme;
        let defaultTheme: Theme = 'system';
        if (configDefault && configDefault !== 'system') {
          defaultTheme = (configDefault as ThemeDefinition).name;
        }

        // Use saved theme, or defaultTheme, or 'system'
        const savedTheme: Theme = savedThemeValue || defaultTheme;
        const resolved = resolveTheme(savedTheme);

        patchState(store, {
          theme: savedTheme,
          resolvedTheme: resolved,
          customVariables: storedVars,
          favoriteThemes: favorites,
          initialized: true,
        });

        applyTheme(resolved, storedVars);
        setupSystemThemeListener();
      },

      /**
       * Set and persist theme preference
       */
      setTheme(theme: Theme): void {
        const resolved = resolveTheme(theme);

        // Update state and DOM first for instant UI feedback
        patchState(store, { theme, resolvedTheme: resolved });
        applyTheme(resolved, store.customVariables());

        // Persist to storage
        saveToStorage(STORAGE_KEY, theme);
      },

      /**
       * Toggle between dark and light theme.
       * Finds the opposite dark/light theme from the available themes.
       */
      toggleTheme(): void {
        const current = store.resolvedTheme();
        const themes = getThemes();
        const currentDef = themes.find(t => t.name === current);
        const target = currentDef?.isDark
          ? themes.find(t => !t.isDark)
          : themes.find(t => t.isDark);
        if (target) {
          this.setTheme(target.name);
        }
      },

      /**
       * Set a custom variable override
       */
      setVariable(key: string, value: string): void {
        const newVars = { ...store.customVariables(), [key]: value };
        patchState(store, { customVariables: newVars });

        const root = document.documentElement;
        root.style.setProperty(key, value);

        saveToStorage(CUSTOM_VARS_KEY, JSON.stringify(newVars));
      },

      /**
       * Save current variables as a favorite theme
       */
      saveFavorite(name: string): void {
        const newFavorite: FavoriteTheme = {
          name,
          variables: { ...store.customVariables() },
        };

        const currentFavorites = store.favoriteThemes();
        const existingIndex = currentFavorites.findIndex(f => f.name === name);
        let newFavorites: FavoriteTheme[];

        if (existingIndex >= 0) {
          newFavorites = [...currentFavorites];
          newFavorites[existingIndex] = newFavorite;
        } else {
          newFavorites = [...currentFavorites, newFavorite];
        }

        patchState(store, { favoriteThemes: newFavorites });
        saveToStorage(FAVORITES_KEY, JSON.stringify(newFavorites));
      },

      /**
       * Delete a favorite theme
       */
      deleteFavorite(name: string): void {
        const newFavorites = store.favoriteThemes().filter(f => f.name !== name);
        patchState(store, { favoriteThemes: newFavorites });
        saveToStorage(FAVORITES_KEY, JSON.stringify(newFavorites));
      },

      /**
       * Apply a favorite theme
       */
      applyFavorite(favorite: FavoriteTheme): void {
        patchState(store, { customVariables: favorite.variables });
        applyVariables(favorite.variables);
        saveToStorage(CUSTOM_VARS_KEY, JSON.stringify(favorite.variables));
      },

      /**
       * Get available themes as typed definitions
       */
      getAvailableThemes(): ThemeDefinition[] {
        return store.themes();
      },

      /**
       * Get current system preference
       */
      getSystemTheme,
    };
  }),
);
