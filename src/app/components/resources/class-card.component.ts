import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { Character } from '@/app/models/Character.model';
import { Class } from '@/app/models/Class.model';
import { EfficiencyType } from '@/app/models/EfficiencyType.enum';
import { Skill } from '@/app/models/Skill.model';
import { CharacterStats } from '@/app/models/Stat.enum';
import { StatSheet } from '@/app/models/StatSheet.model';
import { WeaponType } from '@/app/models/WeaponType.enum';
import { AssetsService } from '@/app/services/assets.service';
import { CharacterService, SkillService } from '@/app/services/resources.service';

@Component({
  selector: 'app-class-card',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div class="bg-gradient-to-br from-gunmetal-400/50 to-gunmetal-600/50 rounded-lg p-6 border border-rich_black-500 space-y-6">
            <!-- Header Section -->
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-xl font-semibold text-baby_powder-500">{{ class.name }}</h3>
                    <div class="flex gap-2 mt-2">
            <span class="px-2 py-1 text-sm rounded-full bg-prussian_blue-500/50 text-air_superiority_blue-400">
              {{ class.type }}
            </span>
                        @if (class.isAdvanced) {
                            <span class="px-2 py-1 text-sm rounded-full bg-mauve-500/20 text-mauve-400">
                Advanced
              </span>
                        }
                    </div>
                </div>

                <!-- Signature Character -->
                @if (class.signatureCharacter) {
                    <div class="flex items-center gap-2 bg-rich_black-500/30 px-3 py-2 rounded-lg">
                        <img
                                [src]="getCharacterImage(getCharacter(class.signatureCharacter).identifier)"
                                [alt]="getCharacter(class.signatureCharacter).name"
                                class="w-10 h-10 rounded-full"
                        />
                        <div class="flex flex-col">
                            <span class="text-xs text-paynes_gray-400">Signature Character</span>
                            <span class="text-sm text-baby_powder-500">
                {{ getCharacter(class.signatureCharacter).name }}
              </span>
                        </div>
                    </div>
                }
            </div>

            <!-- Content Grid -->
            <div class="grid grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-6">
                    <!-- Weapon Proficiencies -->
                    <div>
                        <h4 class="text-sm font-semibold text-mauve-400 mb-3">Weapon Proficiencies</h4>
                        <div class="grid grid-cols-2 gap-2">
                            @for (weapon of class.weapons; track weapon[0]) {
                                <div class="flex items-center gap-2 px-3 py-2 rounded bg-rich_black-500/30">
                                    <img
                                            [src]="getWeaponTypeImage(weapon[0])"
                                            [alt]="weapon[0]"
                                            class="w-6 h-6"
                                    />
                                    <div class="flex flex-col">
                                        <span class="text-sm text-baby_powder-500">{{ weapon[0] }}</span>
                                        <span class="text-xs text-air_superiority_blue-400">Rank {{ weapon[1] }}</span>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    <!-- Class Skill -->
                    @if (class.skill) {
                        <div>
                            <h4 class="text-sm font-semibold text-mauve-400 mb-3">Class Skill</h4>
                            <div class="flex items-center gap-3 p-3 bg-rich_black-500/30 rounded-lg">
                                <img
                                        [src]="getSkillImage(getSkill(class.skill).identifier)"
                                        [alt]="getSkill(class.skill).name"
                                        class="w-8 h-8"
                                />
                                <div>
                                    <p class="text-sm text-baby_powder-500">{{ getSkill(class.skill).name }}</p>
                                    <p class="text-xs text-paynes_gray-400 mt-1">{{ getSkill(class.skill).description }}</p>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <!-- Right Column -->
                <div class="space-y-6">
                    <!-- Base Stats -->
                    <div>
                        <h4 class="text-sm font-semibold text-mauve-400 mb-3">Base Stats</h4>
                        <div class="grid grid-cols-2 gap-2">
                            @for (stat of getStatsArray(class.stats.base); track stat[0]) {
                                <div class="flex justify-between items-center px-3 py-2 bg-rich_black-500/30 rounded">
                                    <span class="text-xs text-paynes_gray-400">{{ getStatDisplayName(stat[0]) }}</span>
                                    <span class="text-sm text-air_superiority_blue-300">{{ stat[1] }}</span>
                                </div>
                            }
                        </div>
                    </div>

                    <!-- Growth Rates -->
                    <div>
                        <h4 class="text-sm font-semibold text-mauve-400 mb-3">Growth Rates</h4>
                        <div class="grid grid-cols-2 gap-2">
                            @for (stat of getStatsArray(class.stats.growth); track stat[0]) {
                                <div class="flex justify-between items-center px-3 py-2 bg-rich_black-500/30 rounded">
                                    <span class="text-xs text-paynes_gray-400">{{ getStatDisplayName(stat[0]) }}</span>
                                    <span class="text-sm" [class]="getGrowthStatClass(stat[1])">{{ stat[1] }}%</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <!-- Weaknesses -->
            @if (class.weakness.length > 0) {
                <div>
                    <h4 class="text-sm font-semibold text-mauve-400 mb-3">Weaknesses</h4>
                    <div class="flex gap-2">
                        @for (type of class.weakness; track type) {
                            <div class="p-2 bg-rich_black-500/30 rounded">
                                <img
                                        [src]="getEfficiencyTypeImage(type)"
                                        [alt]="type"
                                        class="w-6 h-6"
                                />
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    `
})
export class ClassCardComponent {
    @Input({ required: true }) class!: Class;

    private readonly assetsService: AssetsService = inject(AssetsService);
    private readonly skillService: SkillService = inject(SkillService);
    private readonly characterService: CharacterService = inject(CharacterService);

    protected getWeaponTypeImage(weaponType: WeaponType): string {
      return this.assetsService.getWeaponTypeImage(weaponType);
    }

    protected getEfficiencyTypeImage(type: EfficiencyType): string {
      return this.assetsService.getEfficiencyTypeImage(type);
    }

    protected getSkillImage(identifier: string): string {
      return this.assetsService.getSkillImage(identifier);
    }

    protected getCharacterImage(identifier: string): string {
      return this.assetsService.getCharacterImage(identifier);
    }

    protected getSkill(skillId: number): Skill {
      return this.skillService.getResourceById(skillId);
    }

    protected getCharacter(characterId: number): Character {
      return this.characterService.getResourceById(characterId);
    }

    protected getStatsArray(stats: StatSheet): [string, number][] {
      return Object.entries(stats)
        .filter(([name, _]) => name !== CharacterStats.MOV)
        .map(([key, value]) => [key, Number(value)]);
    }

    protected getStatDisplayName(stat: string): string {
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

    protected getGrowthStatClass(value: number): string {
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
