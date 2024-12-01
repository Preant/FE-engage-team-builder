import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CharacterDetailComponent } from './components/character-detail.component';
import { NavbarComponent } from './components/header/navbar.component';


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
        <app-navbar></app-navbar>
        <router-outlet></router-outlet>
    `,
  styles: [`
    `]
})
export class AppComponent {
}
