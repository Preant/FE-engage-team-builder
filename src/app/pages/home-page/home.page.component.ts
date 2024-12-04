import { Component } from '@angular/core';
import { SplitAreaComponent, SplitComponent } from 'angular-split';

import { ResourcesMenuComponent } from '@/app/components/resources-menu.component';
import { NavbarComponent } from '@/app/header/navbar.component';

@Component({
  standalone: true,
  imports: [
    ResourcesMenuComponent,
    SplitComponent,
    SplitAreaComponent,
    NavbarComponent
  ],
  template: `
        <div class="w-full h-full">
            <as-split>
                <as-split-area [size]="40">
                    <app-resources-menu/>
                </as-split-area>
                <as-split-area [size]="60">
                    <div class="h-12">
                        <app-navbar/>
                    </div>
                    <div class="h-[calc(100vh-48px)]">
                        <app-resources-menu/>
                    </div>
                </as-split-area>

            </as-split>
        </div>
    `,
  styles: [`
    `]
})
export class HomePageComponent {

}
