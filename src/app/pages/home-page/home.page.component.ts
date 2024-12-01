import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [],
  template: `
        <div class="home">
            Home
        </div>
    `,
  styles: [`
    .home {
      padding: 1rem;
    }
  `]
})
export class HomePageComponent {

}
