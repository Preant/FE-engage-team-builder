import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';

import { Weapon } from '@/app/models/Weapon.model';
import { AssetsService } from '@/app/services/assets.service';
import { WeaponService } from '@/app/services/weapon.service';

@Component({
  selector: 'weapon-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
        @if (weapon() !== undefined) {
            <div class="min-h-screen w-full bg-rich_black-500 text-mauve-500 relative overflow-hidden">
                <div
                        class="absolute top-0 right-0 bottom-0 w-1/2 bg-cover bg-right opacity-30"
                        [style.background-image]="'url(' + weaponImageUrl() + ')'"
                >
                </div>

                <div class="relative z-10 max-w-7xl mx-auto p-8">
                    <a
                            routerLink="/weapons"
                            class="inline-flex items-center bg-air_superiority_blue-500 text-mauve-500 hover:bg-air_superiority_blue-600 transition-colors duration-300 text-xl px-4 py-2 rounded-full shadow-lg hover:shadow-xl no-underline mb-8"
                    >
                        <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-6 w-6 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                        >
                            <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Weapons
                    </a>

                    <div class="mb-12 text-left">
                        <h1 class="text-6xl font-bold text-air_superiority_blue-500 mb-4">
                            {{ weapon()?.name }}
                        </h1>
                        <p class="text-3xl text-paynes_gray-400">{{ weapon()?.weaponType }}</p>
                    </div>

                    <div class="flex flex-col md:flex-row gap-12">
                        <!-- Combat Stats -->
                        <div class="md:w-auto">
                            <h2 class="text-4xl font-semibold mb-6 text-air_superiority_blue-400 border-b-2 border-air_superiority_blue-400 pb-2">
                                Combat Stats
                            </h2>
                            <ul class="space-y-4">
                                <li class="flex justify-between items-center">
                                    <span class="text-2xl font-bold text-paynes_gray-400">Might</span>
                                    <span class="text-3xl font-bold"
                                          [class]="getMightClass(weapon()?.might || 0)">{{ weapon()?.might }}</span>
                                </li>
                                <li class="flex justify-between items-center">
                                    <span class="text-2xl font-bold text-paynes_gray-400">Hit</span>
                                    <span class="text-3xl font-bold"
                                          [class]="getHitClass(weapon()?.hit || 0)">{{ weapon()?.hit }}%</span>
                                </li>
                                <li class="flex justify-between items-center">
                                    <span class="text-2xl font-bold text-paynes_gray-400">Crit</span>
                                    <span class="text-3xl font-bold"
                                          [class]="getCritClass(weapon()?.crit || 0)">{{ weapon()?.crit }}%</span>
                                </li>
                                <li class="flex justify-between items-center">
                                    <span class="text-2xl font-bold text-paynes_gray-400">Weight</span>
                                    <span class="text-3xl font-bold"
                                          [class]="getWeightClass(weapon()?.weight || 0)">{{ weapon()?.weight }}</span>
                                </li>
                                <li class="flex justify-between items-center">
                                    <span class="text-2xl font-bold text-paynes_gray-400">Range</span>
                                    <span class="text-3xl font-bold text-mauve-500">{{ formatRange(weapon()?.range!) }}</span>
                                </li>
                            </ul>
                        </div>

                        <!-- Additional Info -->
                        <div class="md:w-auto">
                            <h2 class="text-4xl font-semibold mb-6 text-air_superiority_blue-400 border-b-2 border-air_superiority_blue-400 pb-2">
                                Details
                            </h2>
                            <ul class="space-y-4">
                                <li class="flex justify-between items-center">
                                    <span class="text-2xl font-bold text-paynes_gray-400">Rank</span>
                                    <span class="text-3xl font-bold"
                                          [class]="getRankClass(weapon()?.weaponRank || 'E')">
                    {{ weapon()?.weaponRank }}
                  </span>
                                </li>
                                <li class="flex justify-between items-center">
                                    <span class="text-2xl font-bold text-paynes_gray-400">Price</span>
                                    <span class="text-3xl font-bold text-mauve-500">{{ weapon()?.price }}G</span>
                                </li>
                                @if (weapon()?.effectiveness?.length) {
                                    <li class="flex justify-between items-center">
                                        <span class="text-2xl font-bold text-paynes_gray-400">Effective Against</span>
                                        <span class="text-3xl font-bold text-mauve-500">{{ weapon()?.effectiveness?.join(', ') }}</span>
                                    </li>
                                }
                                @if (weapon()?.KnocksBack) {
                                    <li class="flex justify-between items-center">
                                        <span class="text-2xl font-bold text-paynes_gray-400">Special</span>
                                        <span class="text-3xl font-bold text-mauve-500">Knockback</span>
                                    </li>
                                }
                                @if (weapon()?.isEngageWeapon) {
                                    <li class="flex justify-between items-center gap-4">
                                        <span class="text-2xl font-bold text-paynes_gray-400">Type</span>
                                        <span class="text-3xl font-bold text-mauve-500">Engage Weapon</span>
                                    </li>
                                }
                            </ul>
                        </div>
                    </div>

                    <!-- Description -->
                    @if (weapon()?.description) {
                        <div class="mt-12">
                            <h2 class="text-4xl font-semibold mb-6 text-air_superiority_blue-400 border-b-2 border-air_superiority_blue-400 pb-2">
                                Description
                            </h2>
                            <p class="text-2xl text-paynes_gray-400">{{ weapon()?.description }}</p>
                        </div>
                    }
                </div>
            </div>
        } @else {
            <div class="min-h-screen w-full bg-rich_black-500 flex items-center justify-center">
                <div class="text-mauve-500 text-2xl">Loading weapon details...</div>
            </div>
        }
    `,
  styles: [`
        :host {
            display: block;
            width: 100%;
            min-height: 100vh;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        .fade-in {
            animation: fadeIn 0.5s ease-out;
        }
    `]
})
export class WeaponDetailComponent {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private weaponService: WeaponService = inject(WeaponService);
  private assetsService: AssetsService = inject(AssetsService);
  private routeParams: Signal<ParamMap | undefined> = toSignal(this.route.paramMap);
  // Now weapon can be undefined
  public weapon: Signal<Weapon | undefined> = computed((): Weapon | undefined => {
    const name: string = this.routeParams()?.get('identifier') ?? '';
    return this.weaponService.getWeaponByIdentifier(name);
  });
  public weaponImageUrl: Signal<string> = computed((): string => {
    const weapon = this.weapon();
    return weapon ? this.assetsService.getWeaponImage(weapon.identifier) : '';
  });

  formatRange(range: [number, number] | number): string {
    if (typeof range === 'number') {
      return range.toString();
    }
    if (range[0] === range[1]) {
      return range[0].toString();
    }
    return `${range[0]}-${range[1]}`;
  }

  getMightClass(value: number): string {
    if (value <= 8) {
      return 'text-gray-500';
    }
    if (value <= 16) {
      return 'text-red-500';
    }
    if (value <= 24) {
      return 'text-yellow-500';
    }
    if (value <= 32) {
      return 'text-green-500';
    }
    return 'text-blue-500';
  }

  getHitClass(value: number): string {
    if (value <= 75) {
      return 'text-gray-500';
    }
    if (value <= 85) {
      return 'text-red-500';
    }
    if (value <= 95) {
      return 'text-yellow-500';
    }
    return 'text-blue-500';
  }

  getCritClass(value: number): string {
    if (value === 0) {
      return 'text-gray-500';
    }
    if (value <= 10) {
      return 'text-red-500';
    }
    if (value <= 20) {
      return 'text-yellow-500';
    }
    return 'text-blue-500';
  }

  getWeightClass(value: number): string {
    if (value >= 15) {
      return 'text-gray-500';
    }
    if (value >= 10) {
      return 'text-red-500';
    }
    if (value >= 5) {
      return 'text-yellow-500';
    }
    return 'text-green-500';
  }

  getRankClass(rank: string): string {
    const ranks = ['E', 'D', 'C', 'B', 'A', 'S'];
    const colors = [
      'text-gray-500',
      'text-red-500',
      'text-yellow-500',
      'text-green-500',
      'text-blue-500',
      'text-purple-500'
    ];
    const index = ranks.indexOf(rank);
    return colors[index] || colors[0];
  }
}
