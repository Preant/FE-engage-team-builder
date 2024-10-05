import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, NgOptimizedImage],
    template: `
        <nav class="bg-gradient-to-r from-rich_black-500 to-gunmetal-500 p-4 shadow-lg">
            <div class="container mx-auto flex justify-between items-center">
                <a routerLink="/"
                   class="text-baby_powder-500 text-2xl font-bold inline-flex items-center group transition-all duration-300 ease-in-out transform hover:scale-105">
                    <img ngSrc="assets/images/logo.png" alt="Logo" class="h-12 w-12 inline-block mr-2" width="500"
                         height="500">
                    <span class="hidden sm:inline-block font-semibold">
                        <span class="gradient-text text-2xl">
                            Fire Emblem Engage
                        </span>
                        <span class="text-xs text-baby_powder-400 ml-2 group-hover:text-baby_powder-300">
                            Team Builder
                        </span>
                    </span>
                </a>
                <ul class="flex space-x-6">
                    <li *ngFor="let item of navItems">
                        <a [routerLink]="item.link"
                           routerLinkActive="text-forest_green-500 font-bold"
                           [routerLinkActiveOptions]="{exact: true}"
                           class="text-baby_powder-500 hover:text-forest_green-500 transition-colors duration-300 
                           font-semibold
                           relative after:content-[''] after:absolute after:w-full after:h-0.5 
                           after:bg-forest_green-500 after:left-0 after:bottom-0 
                           after:transform after:scale-x-0 after:transition-transform 
                           after:duration-300 hover:after:scale-x-100">
                            {{ item.label }}
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    `,
    styles: [`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');

        .gradient-text {
            background-image: linear-gradient(to right, #ff0000, #ff00ff, #0000ff);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            font-family: 'Cinzel', serif;
            font-weight: 700;
            letter-spacing: 1px;
        }
    `]
})
export class NavbarComponent {
    navItems = [
        {label: 'TeamBuilder', link: '/team-builder'},
        {label: 'DataBank', link: '/data-bank'}
    ];
}
