import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { Character } from '@/app/models/Character.model';
import { ImageType } from '@/app/models/ImageSize.enum';
import { Skill } from '@/app/models/Skill.model';
import { CharacterStats } from '@/app/models/Stat.enum';
import { StatSheet } from '@/app/models/StatSheet.model';
import { AssetsService } from '@/app/services/assets.service';
import { SkillService } from '@/app/services/resources.service';

@Component({
  selector: 'character-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div class="w-full h-full relative rounded-lg bg-gradient-to-br from-rich_black-400/95 to-rich_black-600/95 p-6">
            <!-- Background Character Image -->
            <div class="absolute inset-0 z-0 opacity-10">
                <img
                        [src]="getCharacterImage(character.identifier)"
                        [alt]="character.name"
                        class="w-full h-full object-cover"
                />
            </div>

            <!-- Content Container -->
            <div class="relative z-10 flex flex-col h-[calc(100%-1.5rem)]">
                <!-- Header Section -->
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h2 class="text-3xl font-bold text-baby_powder-500 mb-2">{{ character.name }}</h2>
                        <p class="text-air_superiority_blue-400">{{ character.country }}</p>
                    </div>

                    <!-- Proficiency Badge -->
                    <div class="flex items-center space-x-2 bg-rich_black-500/50 px-4 py-2 rounded-full">
                        <span class="text-paynes_gray-300">Innate Proficiency:</span>
                        <img
                                [src]="getWeaponTypeIcon(character.innateProficiency)"
                                [alt]="character.innateProficiency"
                                class="w-6 h-6"
                        />
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="flex gap-6 h-full">
                    <!-- Stats Grid with Row Layout -->
                    <div class="bg-rich_black-500/30 p-4 rounded-lg w-64 h-fit">
                        <h3 class="text-xl font-semibold text-mauve-400 mb-4">Growth Rates</h3>
                        <div class="flex flex-col gap-2">
                            @for (stat of getStatsArray(character.growth); track stat[0]) {
                                <div class="flex items-center justify-between px-3 py-1.5 bg-rich_black-500/20 rounded-md">
                                    <div class="text-paynes_gray-400 text-sm">{{ getStatDisplayName(stat[0]) }}</div>
                                    <div [class]="getGrowthStatClass(stat[0], stat[1]) + ' text-lg font-bold'">
                                        {{ stat[1] }}%
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    <!-- Personal Skill Section -->
                    <div class="flex-1 flex items-end">
                        @if (getPersonalSkill(); as skill) {
                            <div class="bg-rich_black-500/30 p-4 rounded-lg w-full">
                                <div class="flex items-center gap-3 mb-4">
                                    <img
                                            [src]="getSkillIcon(skill.identifier)"
                                            [alt]="skill.name"
                                            class="w-8 h-8"
                                    />
                                    <h3 class="text-xl font-semibold text-mauve-400">Personal Skill</h3>
                                </div>
                                <div class="space-y-2">
                                    <p class="text-air_superiority_blue-300 font-medium">{{ skill.name }}</p>
                                    <p class="text-paynes_gray-300">{{ skill.description }}</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    `,
  styles: [`
        :host {
            display: block;
        }
    `]
})
export class CharacterDetailComponent {
    @Input({ required: true }) character!: Character;

    private readonly assetsService: AssetsService = inject(AssetsService);
    private readonly skillService: SkillService = inject(SkillService);

    getCharacterImage(identifier: string): string {
      return this.assetsService.getCharacterImage(identifier, ImageType.BODY);
    }

    getWeaponTypeIcon(weaponType: string): string {
      return this.assetsService.getWeaponTypeImage(weaponType);
    }

    getSkillIcon(identifier: string): string {
      return this.assetsService.getSkillImage(identifier, ImageType.BODY);
    }

    getPersonalSkill(): Skill {
      return this.skillService.getResourceById(this.character.personalSkillId);
    }

    getStatDisplayName(stat: string): string {
      const displayNames: Record<string, string> = {
        [CharacterStats.HP]: 'Health',
        [CharacterStats.STR]: 'Strength',
        [CharacterStats.MAG]: 'Magic',
        [CharacterStats.DEX]: 'Dexterity',
        [CharacterStats.SPD]: 'Speed',
        [CharacterStats.DEF]: 'Defense',
        [CharacterStats.RES]: 'Resistance',
        [CharacterStats.LCK]: 'Luck',
        [CharacterStats.MOV]: 'Movement',
        [CharacterStats.BLD]: 'Build'
      };
      return displayNames[stat] || stat.toUpperCase();
    }

    getGrowthStatClass(statName: string, value: number): string {
      if (statName === CharacterStats.MOV) {
        return 'text-mauve-500';
      }
      if (statName === CharacterStats.BLD) {
        return this.getBuildStatClass(value);
      }
      if (statName === CharacterStats.HP) {
        return this.getHPStatClass(value);
      }
      return this.getDefaultStatClass(value);
    }

    public getStatsArray(stats: StatSheet): [string, number][] {
      return Object.entries(stats || {}).map(([key, value]) => [key, Number(value)]);
    }

    private getBuildStatClass(value: number): string {
      const buildColors: string[] = [
        'text-purple-500',
        'text-red-500',
        'text-yellow-500',
        'text-green-500',
        'text-blue-500'
      ];
      const index: number = [0, 5, 10, 15, 20].indexOf(value);
      return index !== -1 ? buildColors[index] : 'text-mauve-500';
    }

    private getHPStatClass(value: number): string {
      if (value < 50) {return 'text-gray-500';}
      if (value < 60) {return 'text-red-500';}
      if (value < 70) {return 'text-yellow-500';}
      if (value < 80) {return 'text-green-500';}
      return 'text-blue-500';
    }

    private getDefaultStatClass(value: number): string {
      if (value <= 10) {return 'text-gray-500';}
      if (value <= 20) {return 'text-red-500';}
      if (value <= 35) {return 'text-yellow-500';}
      if (value <= 45) {return 'text-green-500';}
      return 'text-blue-500';
    }
}
