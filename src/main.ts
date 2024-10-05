import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from "./app/app-routing.module";
import { importProvidersFrom } from "@angular/core";

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(), provideAnimationsAsync(),
        importProvidersFrom(AppRoutingModule)
    ]
}).catch(err => console.error(err));
