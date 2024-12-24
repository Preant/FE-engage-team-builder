import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { TeamID } from '@/app/brands/ResourceID.brand';
import { Character } from '@/app/models/Character.model';
import { ImageType } from '@/app/models/ImageSize.enum';
import { Team } from '@/app/models/Team.model';
import { AssetsService } from '@/app/services/assets.service';
import { ColorService } from '@/app/services/Color.service';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
        <div
                class="relative bg-gradient-to-br from-gunmetal-400/50 to-gunmetal-600/50 rounded-lg p-4 border border-rich_black-500 cursor-pointer hover:border-air_superiority_blue-500 transition-all duration-200"
                (click)="onSelect.emit(team.id)"
        >
            <div class="flex justify-between items-center">
                <p-button
                        icon="pi pi-download"
                        (click)="$event.stopPropagation(); onExport.emit(team.id)"
                />
                <h3 class="text-lg font-semibold text-baby_powder-500">{{ team.name }}</h3>
                <button
                        class="text-paynes_gray-500 hover:text-mauve-500 transition-colors duration-200"
                        (click)="$event.stopPropagation(); onDelete.emit(team)"
                >
                    <i class="pi pi-trash"></i>
                </button>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
                @for (member of team.members; track member.id) {
                    <div class="relative">
                        @if (member.character) {
                            <img
                                    [src]="getCharacterImage(member.character.identifier)"
                                    [alt]="member.character.name"
                                    class="w-16 h-16 rounded-full border-2"
                                    [style.border-color]="getCharacterColor(member.character)"
                            >
                            @if (member.emblem) {
                                <div class="absolute -bottom-1 -right-1">
                                    <img
                                            [src]="getEmblemImage(member.emblem.identifier)"
                                            [alt]="member.emblem.name"
                                            class="w-8 h-8 rounded-full border border-air_superiority_blue-500 bg-rich_black-500"
                                    >
                                </div>
                            }
                        } @else {
                            <div class="w-16 h-16 rounded-full border-2 border-paynes_gray-500 bg-rich_black-500 flex items-center justify-center">
                                <span class="text-paynes_gray-500 text-xs">Empty</span>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    `
})
export class TeamCardComponent {
    @Input({ required: true }) team!: Team;
    @Output() onSelect: EventEmitter<TeamID> = new EventEmitter<TeamID>();
    @Output() onDelete: EventEmitter<Team> = new EventEmitter<Team>();
    @Output() onExport: EventEmitter<TeamID> = new EventEmitter<TeamID>();

    private readonly assetsService: AssetsService = inject(AssetsService);
    private readonly colorService: ColorService = inject(ColorService);

    getCharacterImage(identifier: string): string {
      return this.assetsService.getCharacterImage(identifier, ImageType.BODY_SMALL);
    }

    getEmblemImage(identifier: string): string {
      return this.assetsService.getEmblemImage(identifier, ImageType.BODY);
    }

    getCharacterColor(character: Character): string {
      return this.colorService.getColorForCharacter(character);
    }
}
