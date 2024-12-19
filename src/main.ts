import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import Aura from '@primeng/themes/aura';
import { ConfirmationService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';

import { appInitializer } from '@/app/config/appInitializer';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),
    importProvidersFrom(AppRoutingModule),
    ConfirmationService,
    appInitializer
  ]
}).catch((err: any) => console.error(err));
