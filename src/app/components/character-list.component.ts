import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { CharacterSmallCardComponent } from './character-small-card.component';
import { Character } from '../models/Character.model';
import { Country } from '../models/Country.enum';
import { CharacterService } from '../services/character.service';

@Component({
  selector: 'character-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    CharacterSmallCardComponent,
    NgStyle
  ],
  template: `
        <div class="p-4 bg-gradient-to-br from-rich_black-500 to-gunmetal-500">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div *ngFor="let country of countries"
                     class="country-box rounded-lg shadow-lg overflow-hidden relative"
                     [ngStyle]="{'background-image': 'url(/api/placeholder/800/600)'}">
                    <div class="absolute inset-0 bg-forest_green-700 opacity-70"></div>
                    <div class="relative z-10">
                        <h2 class="text-2xl font-bold p-4 bg-pakistan_green-600 bg-opacity-80 text-baby_powder-500 font-cinzel">{{ country }}</h2>
                        <div class="p-4 flex flex-wrap gap-4">
                            <div *ngFor="let character of groupedCharacters[country]">
                                <character-small-card
                                        [character]="character"
                                        class="transition-all duration-300 hover:scale-105"
                                ></character-small-card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
  styles: [`
        .country-box {
            transition: all 0.3s ease-in-out;
            background-size: cover;
            background-position: center;
        }

        .country-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }`]
})
export class CharacterListComponent implements OnInit {
  public characters: Character[] = [];
  public groupedCharacters: { [key: string]: Character[] } = {};
  public countries: string[] = Object.values(Country);

  constructor(private characterService: CharacterService) {
  }

  ngOnInit() {
    this.characterService.getCharacters().subscribe((characters: Character[]) => {
      this.characters = characters;
      this.groupCharactersByCountry();
    });
  }

  private groupCharactersByCountry() {
    this.groupedCharacters = this.characters.reduce((acc, character) => {
      const country = character.country;
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(character);
      return acc;
    }, {} as { [key: string]: Character[] });
  }
}
