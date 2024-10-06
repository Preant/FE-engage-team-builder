import { Component, OnInit } from '@angular/core';
import { CharacterService } from "../services/character.service";
import { Character } from "../models/Character.model";
import { Country } from "../models/Country.enum";
import { NgForOf, NgIf } from "@angular/common";
import { CharacterSmallCardComponent } from "./character-small-card.component";

@Component({
    selector: 'character-list',
    standalone: true,
    imports: [
        NgForOf,
        NgIf,
        CharacterSmallCardComponent
    ],
    template: `
        <div class="p-4 bg-gradient-to-br from-rich_black-500 to-prussian_blue-500">
            <div *ngFor="let country of countries" class="mb-8">
                <h2 class="text-2xl font-bold mb-3 text-mauve-500 font-cinzel">{{ country }}</h2>
                <div class="flex flex-wrap -mx-2">
                    <div *ngFor="let character of groupedCharacters[country]" class="px-2 mb-4">
                        <character-small-card
                                [character]="character"
                                class="transition-all duration-300 hover:scale-105"
                        ></character-small-card>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: []
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
