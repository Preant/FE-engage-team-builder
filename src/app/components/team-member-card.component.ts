import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { CarouselComponent, CarouselItem } from '@/app/components/carousel.component';
import { Character } from '@/app/models/Character.model';
import { Emblem } from '@/app/models/Emblem.model';
import { ImageSize } from '@/app/models/ImageSize.enum';
import { ViewType } from '@/app/models/ViewType.enum';
import { AssetsService } from '@/app/services/assets.service';
import { ViewStateService } from '@/app/services/view-state.service';

@Component({
  selector: 'app-team-member-card',
  standalone: true,
  imports: [CommonModule, CarouselComponent],
  template: `
        <div class="bg-gradient-to-br from-gunmetal-400/50 to-gunmetal-600/50 rounded-lg p-4 backdrop-blur-sm border border-rich_black-500">
            <div class="flex items-center space-x-4">
                <!-- Character Selection -->
                <div class="relative flex-shrink-0" style="width: 280px">
                    <div
                            class="h-24 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-forest_green-500 relative"
                            [class.border-2]="!character"
                            [class.border-dashed]="!character"
                            [class.border-gunmetal-600]="!character"
                            (click)="onCharacterClick()"
                    >
                        @if (character) {
                            <button
                                    (click)="viewCharacterDetails($event)"
                                    class="absolute top-2 right-2 w-6 h-6 bg-forest_green-500 text-baby_powder-500 rounded-full flex items-center justify-center hover:bg-forest_green-600 transition-colors duration-300 z-10"
                                    title="View character details">
                                <span class="text-lg leading-none">+</span>
                            </button>
                        }
                        @if (character; as char) {
                            <div class="flex items-center h-full space-x-4 p-2 bg-gradient-to-r from-rich_black-500/30 to-gunmetal-500/30">
                                <img
                                        [src]="getCharacterImage(char)"
                                        [alt]="char.name"
                                        class="h-full aspect-square object-cover rounded"
                                >
                                <div>
                                    <h3 class="text-xl font-semibold text-baby_powder-500">{{ char.name }}</h3>
                                    <p class="text-sm text-baby_powder-400">{{ char.country }}</p>
                                </div>
                            </div>
                        } @else {
                            <div class="flex items-center justify-center h-full text-gunmetal-700">
                                <span>Select Character</span>
                            </div>
                        }
                    </div>

                    @if (showCharacterSelection) {
                        <div class="absolute left-full ml-2 z-10" style="width: 400px">
                            <app-carousel
                                    [items]="availableCharacters"
                                    (itemSelected)="onCharacterSelected($event)"
                            />
                        </div>
                    }
                </div>
                <!-- Rest of the template remains the same -->
            </div>
        </div>
    `
})
export class TeamMemberCardComponent {
    @Input() character: Character | null = null;
    @Input() emblem: Emblem | null = null;
    @Input() weapons: (string | null)[] = [];
    @Input() availableCharacters: CarouselItem[] = [];
    @Input() availableEmblems: CarouselItem[] = [];
    @Input() showCharacterSelection = false;
    @Input() showEmblemSelection = false;
    @Output() characterClick = new EventEmitter<void>();
    @Output() emblemClick = new EventEmitter<void>();
    @Output() characterSelect = new EventEmitter<number>();
    @Output() emblemSelect = new EventEmitter<number>();

    private assetsService = inject(AssetsService);
    private viewStateService = inject(ViewStateService);

    getCharacterImage(character: Character): string {
      return this.assetsService.getCharacterImage(character.identifier, ImageSize.SMALL);
    }

    getEmblemImage(emblem: Emblem): string {
      return this.assetsService.getEmblemImage(emblem.resourceIdentifier, ImageSize.SMALL);
    }

    onCharacterClick(): void {
      this.characterClick.emit();
    }

    onEmblemClick(): void {
      this.emblemClick.emit();
    }

    onCharacterSelected(characterId: number): void {
      this.characterSelect.emit(characterId);
    }

    onEmblemSelected(emblemId: number): void {
      this.emblemSelect.emit(emblemId);
    }

    viewCharacterDetails(event: Event): void {
      event.stopPropagation();
      if (this.character) {
        this.viewStateService.setSelectedCharacterId(this.character.id);
        this.viewStateService.setView(ViewType.CHARACTERS);
      }
    }
}
