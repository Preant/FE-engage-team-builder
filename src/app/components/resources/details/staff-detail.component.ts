import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { ImageType } from '@/app/models/ImageSize.enum';
import { Staff } from '@/app/models/Staff.model';
import { AssetsService } from '@/app/services/assets.service';
import { ColorService } from '@/app/services/Color.service';

@Component({
  selector: 'staff-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div class="w-full h-full relative rounded-lg bg-gradient-to-br from-rich_black-400/95 to-rich_black-600/95 p-6">
            <!-- Background Staff Image -->
            <div class="absolute left-96 top-40 inset-0 z-0 opacity-10">
                <img
                        [src]="getStaffImage(staff.identifier)"
                        [alt]="staff.name"
                        class="w-96 h-96 object-cover"
                />
            </div>

            <!-- Content Container -->
            <div class="relative z-10 flex flex-col h-[calc(100%-1.5rem)]">
                <!-- Header Section -->
                <div class="flex justify-between items-start mb-6">
                    <div class="flex items-center gap-4">
                        <div>
                            <h2 class="text-3xl font-bold text-baby_powder-500 mb-2">{{ staff.name }}</h2>
                            <div class="flex gap-2">
                                @if (staff.isUnique) {
                                    <span class="px-2 py-1 rounded bg-mauve-500/20 text-mauve-400 text-sm">
                    Unique
                  </span>
                                }
                                @if (staff.isEngageWeapon) {
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
                            {{ staff.rank }}
                        </div>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="flex gap-6">
                    <!-- Stats Section -->
                    <div class="bg-rich_black-500/30 p-4 rounded-lg w-64">
                        <h3 class="text-xl font-semibold text-mauve-400 mb-4">Stats</h3>
                        <div class="flex flex-col gap-2">
                            <div class="stat-row">
                                <span class="text-paynes_gray-400">Heal</span>
                                <span class="text-air_superiority_blue-300">{{ staff.heal }}</span>
                            </div>
                            <div class="stat-row">
                                <span class="text-paynes_gray-400">Hit</span>
                                <span class="text-air_superiority_blue-300">{{ staff.hit }}</span>
                            </div>
                            <div class="stat-row">
                                <span class="text-paynes_gray-400">Range</span>
                                <span class="text-air_superiority_blue-300">
                  {{ staff.range[0] }}–{{ staff.range[1] }}
                </span>
                            </div>
                            <div class="stat-row">
                                <span class="text-paynes_gray-400">Weight</span>
                                <span class="text-air_superiority_blue-300">{{ staff.weight }}</span>
                            </div>
                            <div class="stat-row">
                                <span class="text-paynes_gray-400">Price</span>
                                <span class="text-air_superiority_blue-300">{{ staff.price }}G</span>
                            </div>
                        </div>
                    </div>

                    <!-- Description Section -->
                    <div class="flex-1">
                        <div class="bg-rich_black-500/30 p-4 rounded-lg h-full">
                            <h3 class="text-xl font-semibold text-mauve-400 mb-4">Description</h3>
                            <p class="text-paynes_gray-300">{{ staff.description }}</p>
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
export class StaffDetailComponent {
    @Input({ required: true }) staff!: Staff;

    private readonly assetsService = inject(AssetsService);
    private readonly colorService = inject(ColorService);

    getStaffImage(identifier: string): string {
      return this.assetsService.getStaffImage(identifier, ImageType.BODY);
    }

    getRankColor(): string {
      return this.colorService.getColorForWeaponRank(this.staff.rank);
    }
}
