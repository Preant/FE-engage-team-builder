import { Component } from '@angular/core';

import { ResourcesComponent } from '@/app/components/resources.component';

@Component({
  standalone: true,
  imports: [
    ResourcesComponent
  ],
  template: `
        <div class="w-full h-full">
            <app-resources/>
        </div>
    `,
  styles: [`
    `]
})
export class HomePageComponent {

}
