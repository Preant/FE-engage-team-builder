import { Component, effect, inject, signal, WritableSignal } from '@angular/core';

import { CarouselComponent, CarouselItem } from '@/app/components/carousel.component';
import { CharacterDetailComponent } from '@/app/components/character-detail.component';
import { Character } from '@/app/models/Character.model';
import { ImageSize } from '@/app/models/ImageSize.enum';
import { AssetsService } from '@/app/services/assets.service';
import { CharacterService } from '@/app/services/resources.service';
import { ViewStateService } from '@/app/services/view-state.service';

@Component({
  selector: 'app-characters',
  imports: [
    CarouselComponent,
    CharacterDetailComponent
  ],
  template: `
        <div class="min-h-screen p-6 bg-gradient-to-br from-prussian_blue-400 to-rich_black-600">
            <div class="space-y-6">
                <app-carousel
                        [items]="getCarouselItems()"
                        (itemSelected)="handleItemSelected($event)"/>

                @if (selectedCharacter(); as character) {
                    <div class="mt-8 fade-in">
                        <character-detail [character]="character"/>
                    </div>
                }
            </div>
        </div>
    `,
  standalone: true,
  styles: [`
        :host {
            display: block;
            min-height: 100vh;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .fade-in {
            animation: fadeIn 0.5s ease-out;
        }
    `]
})
export class CharactersComponent {
  selectedCharacter: WritableSignal<Character | null> = signal(null);
  private assetsService: AssetsService = inject(AssetsService);
  private characterService: CharacterService = inject(CharacterService);
  private viewStateService: ViewStateService = inject(ViewStateService);

  constructor() {
    effect(() => {
      const selectedId: number | null = this.viewStateService.getSelectedCharacterId()();
      if (selectedId !== null) {
        const character: Character | undefined = this.characterService.resources().find((character: Character) => character.id === selectedId);
        if (character) {
          this.selectedCharacter.set(character);
        }
        this.viewStateService.setSelectedCharacterId(null);
      }
    });
  }

  getCarouselItems(): CarouselItem[] {
    return this.characterService.resources().map((character: Character): CarouselItem => ({
      id: character.id,
      label: character.name,
      imageUrl: this.assetsService.getCharacterImage(character.identifier, ImageSize.SMALL)
    }));
  }

  handleItemSelected(id: number): void {
    const character: Character | undefined = this.characterService.resources().find((character: Character) => character.id === id);
    if (character) {
      this.selectedCharacter.set(character);
    }
  }
}
