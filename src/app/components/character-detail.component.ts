import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, Signal, signal, WritableSignal } from '@angular/core';

import { Character } from '@/app/models/Character.model';
import { ImageSize } from '@/app/models/ImageSize.enum';
import { StatSheet } from '@/app/models/StatSheet.model';
import { AssetsService } from '@/app/services/assets.service';

@Component({
  selector: 'character-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div class="min-h-screen w-full bg-rich_black-500 text-mauve-500 relative overflow-hidden">
            <div
                    class="absolute inset-0 bg-cover bg-center opacity-20"
                    [style.background-image]="'url(' + characterImageUrl() + ')'"
            >
            </div>

            <div class="relative z-10 max-w-7xl mx-auto p-8">
                <div class="mb-12 text-left">
                    <h1 class="text-6xl font-bold text-air_superiority_blue-500 mb-4">
                        {{ character.name }}
                    </h1>
                    <p class="text-3xl text-paynes_gray-400">{{ character.country }}</p>
                </div>

                <div class="flex flex-col md:flex-row gap-12">
                    <div class="md:w-auto">
                        <h2 class="text-4xl font-semibold mb-6 text-air_superiority_blue-400 border-b-2 border-air_superiority_blue-400 pb-2">
                            Base Stats
                        </h2>
                        <ul class="space-y-4">
                            @for (stat of baseStats(); track stat[0]) {
                                <li class="flex justify-between items-center">
                  <span class="text-2xl font-bold text-paynes_gray-400 capitalize mr-4">
                    {{ stat[0] }}
                  </span>
                                    <span class="text-3xl font-bold">{{ stat[1] }}</span>
                                </li>
                            }
                        </ul>
                    </div>
                    <div class="md:w-auto">
                        <h2 class="text-4xl font-semibold mb-6 text-air_superiority_blue-400 border-b-2 border-air_superiority_blue-400 pb-2">
                            Growth Stats
                        </h2>
                        <ul class="space-y-4">
                            @for (stat of growthStats(); track stat[0]) {
                                <li class="flex justify-between items-center">
                  <span class="text-2xl font-bold text-paynes_gray-400 capitalize mr-4">
                    {{ stat[0] }}
                  </span>
                                    <span
                                            class="text-3xl font-bold"
                                            [ngClass]="getGrowthStatClass(stat[0], stat[1])"
                                    >
                    {{ stat[1] }}%
                  </span>
                                </li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `,
  styles: [`
        :host {
            display: block;
            width: 100%;
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
export class CharacterDetailComponent {
  private characterSignal: WritableSignal<Character> = signal({} as Character);
  public baseStats: Signal<[string, number][]> = computed(() =>
    this.getStatsArray(this.characterSignal().base)
  );
  public growthStats: Signal<[string, number][]> = computed(() =>
    this.getStatsArray(this.characterSignal().growth)
  );
  private assetsService: AssetsService = inject(AssetsService);
  public characterImageUrl: Signal<string> = computed((): string =>
    this.assetsService.getCharacterImage(this.characterSignal().identifier, ImageSize.LARGE)
  );

  get character(): Character {
    return this.characterSignal();
  }

    @Input({ required: true })
  set character(value: Character) {
    this.characterSignal.set(value);
  }

    getGrowthStatClass(statName: string, value: number): string {
      if (statName === 'mov') {
        return 'text-mauve-500';
      }
      if (statName === 'bld') {
        return this.getBuildStatClass(value);
      }
      if (statName === 'hp') {
        return this.getHPStatClass(value);
      }
      return this.getDefaultStatClass(value);
    }

    private getStatsArray(stats: StatSheet): [string, number][] {
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
      if (value < 50) {
        return 'text-gray-500';
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
        return 'text-gray-500';
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
