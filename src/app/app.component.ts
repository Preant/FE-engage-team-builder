import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CharacterDetailComponent } from '@/app/components/character-detail.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    CharacterDetailComponent
  ],
  template: `
        <div class="h-screen w-screen">
            <router-outlet></router-outlet>
        </div>
    `,
  styles: [`
    `]
})
export class AppComponent {
}
