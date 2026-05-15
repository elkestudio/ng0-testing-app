import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTheme } from '@ng0/ui';
import { routes } from './app.routes';
import { TEST_DARK, TEST_LIGHT } from './theme/theme.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideTheme({ themes: [TEST_DARK, TEST_LIGHT], prefersLight: TEST_LIGHT, prefersDark: TEST_DARK }),
  ],
};
