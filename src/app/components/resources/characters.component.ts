import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, Signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';

import { CarouselComponent, CarouselItem } from '@/app/components/carousel.component';
import { CharacterDetailComponent } from '@/app/components/resources/details/character-detail.component';
import { Character } from '@/app/models/Character.model';
import { Country } from '@/app/models/Country.enum';
import { Gender } from '@/app/models/Gender.enum';
import { ImageType } from '@/app/models/ImageSize.enum';
import { AssetsService } from '@/app/services/assets.service';
import { CharacterService } from '@/app/services/resources.service';
import { ViewStateService } from '@/app/services/view-state.service';

export enum CharacterFilterType {
    ALL = 'ALL',
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectButtonModule,
    CarouselComponent,
    CharacterDetailComponent
  ],
  template: `
        <div class="w-full h-full flex flex-col p-6 bg-gradient-to-br from-prussian_blue-400 to-rich_black-600">
            <!-- Filters -->
            <div class="flex flex-col gap-4 mb-4">
                <div class="flex justify-between items-center">
                    <!-- Gender Filter -->
                    <p-selectButton
                            [options]="genderFilterOptions"
                            [(ngModel)]="selectedGenderFilter"
                            [multiple]="false"
                            [allowEmpty]="false"
                            optionLabel="label"
                            optionValue="value"
                    ></p-selectButton>

                    <!-- Country Filter -->
                    <p-selectButton
                            [options]="countryFilterOptions"
                            [(ngModel)]="selectedCountry"
                            [multiple]="false"
                            [allowEmpty]="false"
                            optionLabel="label"
                            optionValue="value"
                    ></p-selectButton>
                </div>
            </div>

            <!-- Carousel -->
            <app-carousel
                    [items]="carouselItems()"
                    (itemSelected)="handleItemSelected($event)"
            />

            <!-- Character Detail -->
            @if (selectedCharacter(); as character) {
                <character-detail class="h-full mt-8" [character]="character"/>
            }
        </div>
    `
})
export class CharactersComponent {
  protected selectedCharacter: WritableSignal<Character | null> = signal(null);
  protected selectedGenderFilter: WritableSignal<CharacterFilterType> = signal(CharacterFilterType.ALL);
  protected selectedCountry: WritableSignal<Country | null> = signal(null);

  protected readonly genderFilterOptions = [
    { label: 'All', value: CharacterFilterType.ALL },
    { label: 'Male', value: CharacterFilterType.MALE },
    { label: 'Female', value: CharacterFilterType.FEMALE }
  ];

  protected readonly countryFilterOptions = [
    { label: 'All', value: null },
    ...Object.entries(Country).map(([key, value]) => ({
      label: value,
      value: value as Country
    }))
  ];

  private assetsService: AssetsService = inject(AssetsService);
  private characterService: CharacterService = inject(CharacterService);
  private viewStateService: ViewStateService = inject(ViewStateService);

  private filteredCharacters: Signal<Character[]> = computed((): Character[] => {
    let characters: Character[] = this.characterService.resources();

    // Apply country filter
    const selectedCountry: Country | null = this.selectedCountry();
    if (selectedCountry) {
      characters = characters.filter((character: Character) => character.country === selectedCountry);
    }

    // Apply gender filter
    switch (this.selectedGenderFilter()) {
      case CharacterFilterType.MALE:
        characters = characters.filter((character: Character) => character.gender === Gender.MALE);
        break;
      case CharacterFilterType.FEMALE:
        characters = characters.filter((character: Character) => character.gender === Gender.FEMALE);
        break;
      default:
    }

    return characters;
  });

  readonly carouselItems: Signal<CarouselItem[]> = computed(() =>
    this.filteredCharacters().map((character: Character) => ({
      id: character.id,
      label: character.name,
      imageUrl: this.assetsService.getCharacterImage(character.identifier, ImageType.BODY_SMALL)
    }))
  );

  constructor() {
    effect(() => {
      const selectedId: number | null = this.viewStateService.getSelectedCharacterId()();
      if (selectedId !== null) {
        const character: Character | undefined = this.characterService.resources()
          .find((character: Character) => character.id === selectedId);
        if (character) {
          this.selectedCharacter.set(character);
        }
        this.viewStateService.setSelectedCharacterId(null);
      }
    });
  }

  protected handleItemSelected(id: number): void {
    const character: Character | undefined = this.characterService.resources()
      .find((character: Character) => character.id === id);
    if (character) {
      this.selectedCharacter.set(character);
    }
  }
}
