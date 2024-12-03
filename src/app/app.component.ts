import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CharacterDetailComponent } from '@/app/components/character-detail.component';
import { NavbarComponent } from '@/app/header/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    CharacterDetailComponent,
    NavbarComponent
  ],
  template: `
        <div class="app-component">
            <div class="header h-[var(--header-height)]">
                <app-navbar></app-navbar>
            </div>

            <div class="h-[calc(100vh-var(--header-height))]">
                <router-outlet></router-outlet>
            </div>
        </div>
    `,
  styles: [`
        .header {
            position: sticky;
            top: 0;
            z-index: 1;
        }
    `]
})
export class AppComponent {
}
