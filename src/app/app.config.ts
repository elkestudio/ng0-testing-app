import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTheme } from '@ng0/ui';
import { routes } from './app.routes';
import { PURPLE_MOON } from './theme/theme.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideTheme({ themes: [PURPLE_MOON], prefersLight: PURPLE_MOON, prefersDark: PURPLE_MOON }),
  ],
};
