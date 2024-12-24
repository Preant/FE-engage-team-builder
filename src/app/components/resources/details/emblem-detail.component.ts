import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, signal, Signal, WritableSignal } from '@angular/core';

import { Emblem } from '@/app/models/Emblem.model';
import { ImageType } from '@/app/models/ImageSize.enum';
import { CharacterStats } from '@/app/models/Stat.enum';
import { StatSheet } from '@/app/models/StatSheet.model';
import { Weapon } from '@/app/models/Weapon.model';
import { WeaponType } from '@/app/models/WeaponType.enum';
import { AssetsService } from '@/app/services/assets.service';
import { EmblemService } from '@/app/services/resources.service';

@Component({
  selector: 'emblem-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div class="w-full h-full relative rounded-lg bg-gradient-to-br from-rich_black-400/95 to-rich_black-600/95 p-6">
            <!-- Background Emblem Image with gradient mask -->
            <div class="absolute inset-0 z-0">
                <div class="w-full h-full relative">
                    <img
                            [src]="getEmblemImage(emblem.identifier)"
                            [alt]="emblem.name"
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
                    <!-- Left side: Emblem info -->
                    <div class="flex items-center gap-4">
                        <img
                                [src]="getEmblemStampImage(emblem.identifier)"
                                [alt]="emblem.name"
                                class="w-32 h-32 object-cover rounded-lg border-2 border-air_superiority_blue-500"
                        />
                        <div>
                            <h2 class="text-3xl font-bold text-baby_powder-500 mb-2">{{ emblem.name }}</h2>
                            <span class="px-3 py-1 rounded-full bg-prussian_blue-500/50 text-air_superiority_blue-400">
                {{ emblem.type }}
              </span>
                        </div>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="flex gap-6">
                    <!-- Engage Weapons Section -->
                    <div class="bg-rich_black-500/30 p-6 rounded-lg flex-1">
                        <h3 class="text-xl font-semibold text-mauve-400 mb-4">Engage Weapons</h3>
                        <div class="grid grid-cols-2 gap-4">
                            @for (weapon of engageWeapons(); track weapon.id) {
                                <div class="flex items-center gap-3 p-3 bg-rich_black-500/20 rounded-lg">
                                    <img
                                            [src]="getWeaponImage(weapon.identifier)"
                                            [alt]="weapon.name"
                                            class="w-12 h-12"
                                    />
                                    <div>
                                        <p class="text-baby_powder-500">{{ weapon.name }}</p>
                                        <div class="flex items-center gap-2 mt-1">
                                            <img
                                                    [src]="getWeaponTypeImage(weapon.weaponType)"
                                                    [alt]="weapon.weaponType"
                                                    class="w-4 h-4"
                                            />
                                            <span class="text-paynes_gray-800 text-sm">{{ weapon.weaponType }}</span>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    <!-- Sync Stats Section -->
                    <div class="bg-rich_black-500/30 p-6 rounded-lg w-1/3 h-fit">
                        <h3 class="text-xl font-semibold text-mauve-400 mb-4">Sync Stat Bonuses</h3>
                        <div class="space-y-3">
                            @for (stat of getStatsArray(emblem.syncStatBonus); track stat[0]) {
                                <div class="stat-row">
                                    <span class="text-paynes_gray-800">{{ getStatDisplayName(stat[0]) }}</span>
                                    <span class="text-air_superiority_blue-800">+{{ stat[1] }}</span>
                                </div>
                            }
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
export class EmblemDetailComponent {
  private readonly _emblem: WritableSignal<Emblem | null> = signal<Emblem | null>(null);

  private readonly assetsService: AssetsService = inject(AssetsService);
  private readonly emblemService: EmblemService = inject(EmblemService);

  engageWeapons: Signal<Weapon[]> = computed((): Weapon[] =>
    this.emblemService.getEngageWeapons(this.emblem.id)()
  );

  get emblem(): Emblem {
    return this._emblem()!;
  }

    @Input({ required: true })
  set emblem(value: Emblem) {
    this._emblem.set(value);
  }

    getEmblemImage(identifier: string): string {
      return this.assetsService.getEmblemImage(identifier, ImageType.BODY);
    }

    getEmblemStampImage(identifier: string): string {
      return this.assetsService.getEmblemImage(identifier, ImageType.STAMP);
    }

    getWeaponImage(identifier: string): string {
      return this.assetsService.getWeaponImage(identifier);
    }

    getWeaponTypeImage(weaponType: WeaponType): string {
      return this.assetsService.getWeaponTypeImage(weaponType);
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

    getStatsArray(stats: Partial<StatSheet>): [string, number][] {
      return Object.entries(stats || {})
        .map(([key, value]) => [key, Number(value)]);
    }
}
