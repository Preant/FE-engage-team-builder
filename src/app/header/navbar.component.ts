import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavItem } from '@/app/models/NavItem';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgOptimizedImage],
  template: `
        <nav class="bg-gradient-to-r from-rich_black-500 to-prussian_blue-500 p-4 shadow-lg h-[var(--header-height)]">
            <div class="container mx-auto flex justify-between items-center">
                <a routerLink="/"
                   class="text-mauve-500 text-2xl font-bold inline-flex items-center group transition-all duration-300 ease-in-out transform hover:scale-105">
                    <img ngSrc="/assets/images/logo.png" alt="Logo" class="h-12 w-12 inline-block mr-2" width="500"
                         priority
                         height="500">
                    <span class="hidden sm:inline-block font-semibold">
                        <span class="gradient-text text-2xl">
                            Fire Emblem Engage
                        </span>
                    </span>
                </a>
                <ul class="flex space-x-6">
                    <li *ngFor="let item of navItems">
                        <a [routerLink]="item.link"
                           routerLinkActive="text-air_superiority_blue-500 font-bold"
                           [routerLinkActiveOptions]="{exact: true}"
                           class="text-mauve-500 hover:text-air_superiority_blue-500 transition-colors duration-300
                           font-semibold
                           relative after:content-[''] after:absolute after:w-full after:h-0.5
                           after:bg-air_superiority_blue-500 after:left-0 after:bottom-0
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
        .gradient-text {
            background-image: linear-gradient(to right, #ff0000, #ff00ff, #0000ff);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            font-weight: 700;
            letter-spacing: 1px;
        }
    `]
})
export class NavbarComponent {
  navItems: NavItem[] = [
    { label: 'TeamBuilder', link: '/teambuilder' },
    { label: 'Resources', link: '/resources' }
  ];
}
