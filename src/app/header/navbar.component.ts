import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { NavItem } from '@/app/models/NavItem';
import { ViewType } from '@/app/models/ViewType.enum';
import { ViewStateService } from '@/app/services/view-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgOptimizedImage],
  template: `
        <nav class="h-full bg-gradient-to-r from-rich_black-500 to-prussian_blue-500 shadow-lg">
            <div class="container mx-auto flex justify-around items-center">
                <button (click)="switchViewType(ViewType.RESOURCES)"
                        class="text-mauve-500 text-2xl font-bold inline-flex items-center group transition-all duration-300 ease-in-out transform hover:scale-105">
                    <img ngSrc="/assets/images/logo.png" alt="Logo" class="h-12 w-12 inline-block mr-2" width="500"
                         priority
                         height="500">
                    <span class="hidden sm:inline-block font-semibold">
                        <span class="gradient-text text-xl">
                            Resources
                        </span>
                    </span>
                </button>
                <ul class="flex space-x-6">
                    @for (item of navItems; track $index) {
                        <li>
                            <button (click)="switchViewType(item.viewType)"
                                    routerLinkActive="text-air_superiority_blue-500 font-bold"
                                    [routerLinkActiveOptions]="{exact: true}"
                                    class="text-mauve-500 hover:text-air_superiority_blue-500 transition-colors duration-300
                           font-semibold text-m
                           relative after:content-[''] after:absolute after:w-full after:h-0.5
                           after:bg-air_superiority_blue-500 after:left-0 after:bottom-0
                           after:transform after:scale-x-0 after:transition-transform
                           after:duration-300 hover:after:scale-x-100">
                                {{ item.label }}
                            </button>
                        </li>
                    }

                </ul>
            </div>
        </nav>
    `,
  styles: [`
        .gradient-text {
            background-image: linear-gradient(to right, #ff0000, #ff00ff, #6969db);
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            font-weight: 700;
            letter-spacing: 1px;
        }
    `]
})
export class NavbarComponent {
  viewStateService: ViewStateService = inject(ViewStateService);
  navItems: NavItem[] = [
    { label: 'Characters', viewType: ViewType.CHARACTERS },
    { label: 'Classes', viewType: ViewType.CLASSES },
    { label: 'Emblems', viewType: ViewType.EMBLEMS },
    { label: 'Skills', viewType: ViewType.SKILLS },
    { label: 'Weapons', viewType: ViewType.WEAPONS },
    { label: 'Staves', viewType: ViewType.STAVES },
    { label: 'Forging', viewType: ViewType.FORGING }
  ];
  protected readonly ViewType = ViewType;

  public switchViewType(viewType: ViewType): void {
    this.viewStateService.setView(viewType);
  }
}
