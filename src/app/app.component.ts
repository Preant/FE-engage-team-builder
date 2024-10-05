import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterDetailComponent } from "./components/character-detail.component";
import { NavbarComponent } from "./components/header/navbar.component";
import { RouterOutlet } from "@angular/router";

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
