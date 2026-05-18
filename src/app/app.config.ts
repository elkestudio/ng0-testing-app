import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTheme } from '@ng0/ui';
import { routes } from './app.routes';
import { CRIMSON, ROSE } from './theme/theme.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideTheme({ themes: [CRIMSON, ROSE], prefersLight: ROSE, prefersDark: CRIMSON }),
  ],
};
