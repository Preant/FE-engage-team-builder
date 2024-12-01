import { Component } from '@angular/core';

import { CharacterListComponent } from '@/app/components/character-list.component';

@Component({
  standalone: true,
  imports: [
    CharacterListComponent
  ],
  template: `
        <character-list/>
    `,
  styles: `
    `
})
export class CharactersPageComponent {

}
