import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule
  ],
  template: `
        <div class="h-screen w-screen">
            <router-outlet></router-outlet>
        </div>
    `,
  standalone: true,
  styles: [`
    `]
})
export class AppComponent {
}
