import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CharacterSmallCardComponent } from '@/app/components/character-small-card.component';
import { ResourcesPanelGridComponent } from '@/app/components/panel/characters-panel-grid.component';
import { Character } from '@/app/models/Character.model';
import { CharactersPanelGridConfig } from '@/app/models/CharactersPanelGridConfig.model';
import { Country } from '@/app/models/Country.enum';
import { CharacterService } from '@/app/services/character.service';

@Component({
  selector: 'character-list',
  standalone: true,
  imports: [
    NgStyle,
    CharacterSmallCardComponent,
    ResourcesPanelGridComponent,
    ResourcesPanelGridComponent
  ],
  template: `
        <div class="min-h-screen p-6 bg-gradient-to-br from-prussian_blue-400 to-rich_black-600">
            <div class="grid grid-cols-1 gap-8">
                @for (country of countries; track country) {
                    <div
                            class="country-box rounded-xl shadow-2xl overflow-hidden relative"
                            [ngStyle]="{'background-image': 'url(/api/placeholder/800/600)'}"
                    >
                        <div class="absolute inset-0 bg-gradient-to-br from-prussian_blue-500/90 to-rich_black-400/80"></div>
                        <div class="relative z-10">
                            <h2 class="text-2xl font-bold p-4 bg-gradient-to-r from-mauve-400/20 to-air_superiority_blue-500/20 backdrop-blur-sm text-mauve-100 font-cinzel border-b border-mauve-400/30 shadow-lg">
                                {{ country }}
                            </h2>

                            <div class="p-6">
                                <characters-panel-grid
                                        [items]="groupedCharacters[country]"
                                        [config]="getPanelConfig(country)"
                                        [customTemplate]="characterTemplate"
                                        [trackByFn]="trackByCharacter"
                                ></characters-panel-grid>

                                <ng-template #characterTemplate let-character>
                                    <character-small-card
                                            [character]="character"
                                            class="transform hover:scale-105 transition-all duration-300"
                                    ></character-small-card>
                                </ng-template>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    `,
  styles: [`
        .country-box {
            background-size: cover;
            background-position: center;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
            isolation: isolate;
        }

        .country-box:hover {
            box-shadow: 0 12px 40px rgba(31, 41, 55, 0.25);
        }

        :host {
            display: block;
            min-height: 100vh;
        }
    `]
})
export class CharacterListComponent implements OnInit {
  public characters: Character[] = [];
  public groupedCharacters: { [key: string]: Character[] } = {};
  public countries: Country[] = Object.values(Country);

  constructor(private characterService: CharacterService) {
  }

  ngOnInit() {
    this.characterService.getCharacters().subscribe((characters: Character[]) => {
      this.characters = characters;
      this.groupCharactersByCountry();
    });
  }

  getPanelConfig(country: Country): CharactersPanelGridConfig {
    const charactersCount: number = this.groupedCharacters[country]?.length || 0;
    const cols: number = Math.min(4, Math.ceil(Math.sqrt(charactersCount)));
    const rows: number = Math.ceil(charactersCount / cols);

    return {
      cols,
      rows
    };
  }

  trackByCharacter(character: Character): string {
    return character.resourceIdentifier;
  }

  private groupCharactersByCountry() {
    this.groupedCharacters = this.characters.reduce((acc, character) => {
      const country: Country = character.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(character);
      return acc;
    }, {} as { [key: string]: Character[] });
  }
}
