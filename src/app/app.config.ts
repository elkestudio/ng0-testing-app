import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTheme } from '@ng0/ui';
import { routes } from './app.routes';
import { PURPLE_MOON, PALENIGHT } from './theme/theme.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideTheme({ themes: [PURPLE_MOON, PALENIGHT], prefersLight: PURPLE_MOON, prefersDark: PURPLE_MOON }),
  ],
};
