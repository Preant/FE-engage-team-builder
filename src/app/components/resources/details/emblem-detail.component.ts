import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, Signal } from '@angular/core';

import { Emblem } from '@/app/models/Emblem.model';
import { ImageType } from '@/app/models/ImageSize.enum';
import { Item } from '@/app/models/Item.model';
import { Weapon } from '@/app/models/Weapon.model';
import { AssetsService } from '@/app/services/assets.service';
import { EmblemService } from '@/app/services/resources.service';

@Component({
  selector: 'emblem-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div class="w-full h-full relative rounded-lg bg-gradient-to-br from-rich_black-400/95 to-rich_black-600/95 p-6">
            <!-- Background Emblem Image -->
            <div class="absolute inset-0 z-0 opacity-10">
                <img
                        [src]="getEmblemImage(emblem.identifier)"
                        [alt]="emblem.name"
                        class="w-full h-full object-cover"
                />
            </div>

            <!-- Content Container -->
            <div class="relative z-10 flex flex-col h-[calc(100%-1.5rem)]">
                <!-- Header Section -->
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h2 class="text-3xl font-bold text-baby_powder-500 mb-2">{{ emblem.name }}</h2>
                        <p class="text-air_superiority_blue-400">Emblem Ring</p>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="flex gap-6 h-full">
                    <!-- Weapons Section - Left Side -->
                    <div class="bg-rich_black-500/30 p-4 rounded-lg w-64 h-fit">
                        <h3 class="text-xl font-semibold text-mauve-400 mb-4">Engage Weapons</h3>
                        <div class="flex flex-col gap-2">
                            @for (weapon of engageWeapons(); track weapon.id) {
                                <div class="px-3 py-2 bg-rich_black-500/20 rounded-md">
                                    <div class="flex items-center gap-2 mb-1">
                                        <img
                                                [src]="getWeaponImage(weapon.identifier)"
                                                [alt]="weapon.name"
                                                class="w-6 h-6 object-contain"
                                        />
                                        <span class="text-baby_powder-500 font-medium">{{ weapon.name }}</span>
                                    </div>
                                    <div class="grid grid-cols-2 gap-1 text-sm">
                                        <div class="text-paynes_gray-400">Might</div>
                                        <div class="text-air_superiority_blue-300 text-right">{{ weapon.might }}</div>
                                        <div class="text-paynes_gray-400">Hit</div>
                                        <div class="text-air_superiority_blue-300 text-right">{{ weapon.hit }}</div>
                                        <div class="text-paynes_gray-400">Crit</div>
                                        <div class="text-air_superiority_blue-300 text-right">{{ weapon.crit }}</div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    <!-- Items Section - Right Side -->
                    <div class="flex-1">
                        @if (engageItems().length > 0) {
                            <div class="bg-rich_black-500/30 p-4 rounded-lg w-full">
                                <h3 class="text-xl font-semibold text-mauve-400 mb-4">Engage Items</h3>
                                <div class="grid grid-cols-1 gap-3">
                                    @for (item of engageItems(); track item.id) {
                                        <div class="bg-rich_black-500/20 p-3 rounded-md">
                                            <div class="flex items-center gap-3">
                                                <img
                                                        [src]="getItemImage(item.identifier)"
                                                        [alt]="item.name"
                                                        class="w-8 h-8 object-contain"
                                                />
                                                <div>
                                                    <p class="text-baby_powder-500 font-medium">{{ item.name }}</p>
                                                    <p class="text-paynes_gray-300 text-sm">{{ item.description }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    `
})
export class EmblemDetailComponent {
    @Input({ required: true }) emblem!: Emblem;

    private readonly assetsService: AssetsService = inject(AssetsService);
    private readonly emblemService: EmblemService = inject(EmblemService);

    readonly engageWeapons: Signal<Weapon[]> = computed(() =>
      this.emblemService.getEngageWeapons(this.emblem.id)()
    );

    readonly engageItems: Signal<Item[]> = computed(() =>
      this.emblemService.getEngageItems(this.emblem.id)()
    );

    getEmblemImage(identifier: string): string {
      return this.assetsService.getEmblemImage(identifier, ImageType.BODY);
    }

    getWeaponImage(identifier: string): string {
      return this.assetsService.getWeaponImage(identifier, ImageType.BODY_SMALL);
    }

    getItemImage(identifier: string): string {
      return this.assetsService.getItemImage(identifier, ImageType.BODY_SMALL);
    }
}
