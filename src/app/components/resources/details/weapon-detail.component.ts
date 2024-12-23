import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { EfficiencyType } from '@/app/models/EfficiencyType.enum';
import { ImageType } from '@/app/models/ImageSize.enum';
import { Weapon } from '@/app/models/Weapon.model';
import { WeaponType } from '@/app/models/WeaponType.enum';
import { AssetsService } from '@/app/services/assets.service';
import { ColorService } from '@/app/services/Color.service';

@Component({
  selector: 'weapon-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div class="w-full h-full relative rounded-lg bg-gradient-to-br from-rich_black-400/95 to-rich_black-600/95 p-6">
            <!-- Background Weapon Image -->
            <div class="absolute left-96 top-40 inset-0 z-0 opacity-10">
                <img
                        [src]="getWeaponImage(weapon.identifier)"
                        [alt]="weapon.name"
                        class="w-96 h-96 object-cover"
                />
            </div>

            <!-- Content Container -->
            <div class="relative z-10 flex flex-col h-[calc(100%-1.5rem)]">
                <!-- Header Section -->
                <div class="flex justify-between items-start mb-6">
                    <div class="flex items-center gap-4">
                        <img
                                [src]="getWeaponTypeImage(weapon.weaponType)"
                                [alt]="weapon.weaponType"
                                class="w-8 h-8"
                        />
                        <div>
                            <h2 class="text-3xl font-bold text-baby_powder-500 mb-2">{{ weapon.name }}</h2>
                            <div class="flex gap-2">
                                @if (weapon.isUnique) {
                                    <span class="px-2 py-1 rounded bg-mauve-500/20 text-mauve-400 text-sm">
                    Unique
                  </span>
                                }
                                @if (weapon.isEngageWeapon) {
                                    <span class="px-2 py-1 rounded bg-air_superiority_blue-500/20 text-air_superiority_blue-400 text-sm">
                    Engage
                  </span>
                                }
                            </div>
                        </div>
                    </div>

                    <div class="text-right">
                        <div class="text-paynes_gray-400">Rank</div>
                        <div class="text-2xl font-bold" [style.color]="getRankColor()">
                            {{ weapon.rank }}
                        </div>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="flex gap-6">
                    <!-- Stats Section -->
                    <div class="bg-rich_black-500/30 p-4 rounded-lg w-64">
                        <h3 class="text-xl font-semibold text-mauve-400 mb-4">Combat Stats</h3>
                        <div class="flex flex-col gap-2">
                            <div class="stat-row">
                                <span class="text-paynes_gray-400">Might</span>
                                <span class="text-air_superiority_blue-300">{{ weapon.might }}</span>
                            </div>
                            <div class="stat-row">
                                <span class="text-paynes_gray-400">Hit</span>
                                <span class="text-air_superiority_blue-300">{{ weapon.hit }}</span>
                            </div>
                            <div class="stat-row">
                                <span class="text-paynes_gray-400">Crit</span>
                                <span class="text-air_superiority_blue-300">{{ weapon.crit }}</span>
                            </div>
                            <div class="stat-row">
                                <span class="text-paynes_gray-400">Range</span>
                                <span class="text-air_superiority_blue-300">
                  {{ weapon.range[0] }}–{{ weapon.range[1] }}
                </span>
                            </div>
                            <div class="stat-row">
                                <span class="text-paynes_gray-400">Weight</span>
                                <span class="text-air_superiority_blue-300">{{ weapon.weight }}</span>
                            </div>
                            <div class="stat-row">
                                <span class="text-paynes_gray-400">Price</span>
                                <span class="text-air_superiority_blue-300">{{ weapon.price }}G</span>
                            </div>
                        </div>
                    </div>

                    <!-- Properties Section -->
                    <div class="flex-1">
                        <div class="bg-rich_black-500/30 p-4 rounded-lg h-full">
                            <h3 class="text-xl font-semibold text-mauve-400 mb-4">Properties</h3>

                            @if (weapon.effectiveness.length > 0) {
                                <div class="mb-4">
                                    <h4 class="text-paynes_gray-400 mb-2">Effective Against</h4>
                                    <div class="flex gap-2">
                                        @for (type of weapon.effectiveness; track type) {
                                            <img [src]="getEfficiencyTypeImage(type)" class="w-6 h-6"/>
                                        }
                                    </div>
                                </div>
                            }

                            @if (weapon.KnocksBack) {
                                <div class="mb-4">
                  <span class="px-2 py-1 rounded bg-rich_black-500/20 text-mauve-400">
                    Knocks Back Enemy
                  </span>
                                </div>
                            }

                            <p class="text-paynes_gray-300">{{ weapon.description }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
  styles: [`
        :host {
            display: block;
        }

        .stat-row {
            @apply flex justify-between items-center px-3 py-1.5 bg-rich_black-500/20 rounded-md;
        }
    `]
})
export class WeaponDetailComponent {
    @Input({ required: true }) weapon!: Weapon;

    private readonly assetsService = inject(AssetsService);
    private readonly colorService = inject(ColorService);

    getWeaponImage(identifier: string): string {
      return this.assetsService.getWeaponImage(identifier, ImageType.BODY);
    }

    getWeaponTypeImage(weaponType: WeaponType): string {
      return this.assetsService.getWeaponTypeImage(weaponType);
    }

    getRankColor(): string {
      return this.colorService.getColorForWeaponRank(this.weapon.rank);
    }

    getEfficiencyTypeImage(type: EfficiencyType): string {
      return this.assetsService.getEfficiencyTypeImage(type);
    }
}
