import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { Character } from '@/app/models/Character.model';
import { ImageType } from '@/app/models/ImageSize.enum';
import { CharacterStats } from '@/app/models/Stat.enum';
import { StatSheet } from '@/app/models/StatSheet.model';
import { WeaponType } from '@/app/models/WeaponType.enum';
import { AssetsService } from '@/app/services/assets.service';
import { SkillService } from '@/app/services/resources.service';

@Component({
  selector: 'character-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div class="w-full h-full relative rounded-lg bg-gradient-to-br from-rich_black-400/95 to-rich_black-600/95 p-6">
            <!-- Background Character Image with intense gradient mask -->
            <div class="absolute inset-0 z-0">
                <div class="w-full h-full relative">
                    <img
                            [src]="getCharacterImage(character.identifier)"
                            [alt]="character.name"
                            class="w-full h-full object-scale-down opacity-15"
                            style="mask-image: radial-gradient(circle at center, black 30%, transparent 60%);
                   -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 60%);"
                    />
                </div>
            </div>

            <!-- Content Container -->
            <div class="relative z-10 flex flex-col h-full">
                <!-- Header Section -->
                <div class="flex justify-between items-start mb-28">
                    <!-- Left side: Character info -->
                    <div class="flex items-center gap-4">
                        <img
                                [src]="getCharacterStampImage(character.identifier)"
                                [alt]="character.name"
                                class="w-32 h-32 object-cover rounded-lg border-2 border-air_superiority_blue-500"
                        />
                        <div>
                            <h2 class="text-3xl font-bold text-baby_powder-500 mb-2">{{ character.name }}</h2>
                            <span class="px-3 py-1 rounded-full bg-prussian_blue-500/50 text-air_superiority_blue-400">
                {{ character.country }}
              </span>
                        </div>
                    </div>

                    <!-- Right side: Innate Proficiency -->
                    <div class="flex items-center gap-2">
                        <span class="text-paynes_gray-800">Innate Proficiency:</span>
                        <div class="flex items-center gap-2">
                            <img
                                    [src]="getWeaponTypeImage(character.innateProficiency)"
                                    [alt]="character.innateProficiency"
                                    class="w-8 h-8"
                            />
                            <span class="text-air_superiority_blue-800 font-semibold">
                {{ character.innateProficiency }}
              </span>
                        </div>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="flex gap-6">
                    <!-- Growth Rates -->
                    <div class="bg-rich_black-500/30 p-6 rounded-lg flex-grow h-fit">
                        <h3 class="text-xl font-semibold text-mauve-400 mb-4">Growth Rate</h3>
                        <div class="grid grid-cols-3 gap-4">
                            @for (stat of getStatsArray(character.growth); track stat[0]) {
                                <div class="stat-row">
                                    <span class="text-paynes_gray-800 text-lg mr-3">{{ getStatDisplayName(stat[0]) }}</span>
                                    <div class="flex items-center gap-2">
                    <span [class]="getGrowthStatClass(stat[0], stat[1]) + ' text-lg font-semibold'">
                      {{ stat[1] }}%
                    </span>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    <!-- Personal Skill -->
                    <div class="bg-rich_black-500/30 p-6 rounded-lg w-1/3">
                        <h3 class="text-xl font-semibold text-mauve-400 mb-4">Personal Skill</h3>
                        <div class="flex flex-col gap-3 px-4 py-3 bg-rich_black-500/20 rounded-lg">
                            <div class="flex items-center gap-3">
                                <img
                                        [src]="getSkillImage(character.personalSkillId)"
                                        [alt]="getSkillName(character.personalSkillId)"
                                        class="w-10 h-10"
                                />
                                <p class="text-baby_powder-500 font-medium text-lg">
                                    {{ getSkillName(character.personalSkillId) }}
                                </p>
                            </div>
                            <p class="text-paynes_gray-800">
                                {{ getSkillDescription(character.personalSkillId) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
  styles: [`
        .stat-row {
            @apply flex justify-between items-center px-4 py-2 bg-rich_black-500/20 rounded-md;
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

    getCharacterStampImage(identifier: string): string {
      return this.assetsService.getCharacterImage(identifier, ImageType.STAMP);
    }

    getWeaponTypeImage(weaponType: WeaponType): string {
      return this.assetsService.getWeaponTypeImage(weaponType);
    }

    getSkillImage(skillId: number): string {
      return this.assetsService.getSkillImage(this.skillService.getResourceById(skillId).identifier);
    }

    getSkillName(skillId: number): string {
      return this.skillService.getResourceById(skillId).name;
    }

    getSkillDescription(skillId: number): string {
      return this.skillService.getResourceById(skillId).description;
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

    getStatsArray(stats: StatSheet): [string, number][] {
      return Object.entries(stats || {}).filter(([name, _]) => name !== CharacterStats.MOV).map(([key, value]) => [key, Number(value)]);
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
      if (value < 50) {
        return 'text-purple-500';
      }
      if (value < 60) {
        return 'text-red-500';
      }
      if (value < 70) {
        return 'text-yellow-500';
      }
      if (value < 80) {
        return 'text-green-500';
      }
      return 'text-blue-500';
    }

    private getDefaultStatClass(value: number): string {
      if (value <= 10) {
        return 'text-purple-500';
      }
      if (value <= 20) {
        return 'text-red-500';
      }
      if (value <= 35) {
        return 'text-yellow-500';
      }
      if (value <= 45) {
        return 'text-green-500';
      }
      return 'text-blue-500';
    }
}
