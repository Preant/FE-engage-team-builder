import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { Observable, switchMap } from 'rxjs';

import { CHARACTER_RESOURCE_PATH } from '@/app/config/config';
import { Character } from '@/app/models/Character.model';
import { StatSheet } from '@/app/models/StatSheet.model';
import { CharacterService } from '@/app/services/character.service';

@Component({
  selector: 'character-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
        <div class="min-h-screen w-full bg-rich_black-500 text-mauve-500 relative overflow-hidden">
            <div class="absolute top-0 right-0 bottom-0 w-1/2 bg-cover bg-right opacity-30"
                 [style.background-image]="'url(' + CHARACTER_RESOURCE_PATH + (character$ | async)?.resourceIdentifier + '/' + (character$ | async)?.resourceIdentifier + '_portrait.png' + ')'"></div>

            <div class="relative z-10 max-w-7xl mx-auto p-8">
                <a routerLink="/characters"
                   class="inline-flex items-center bg-air_superiority_blue-500 text-mauve-500 hover:bg-air_superiority_blue-600 transition-colors duration-300 text-xl px-4 py-2 rounded-full shadow-lg hover:shadow-xl no-underline mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                    </svg>
                    Characters
                </a>
                <!--                @if (character$ | async as character) {
                                }-->
                <ng-container *ngIf="character$ | async as character">
                    <div class="mb-12 text-left">
                        <h1 class="text-6xl font-bold text-air_superiority_blue-500 mb-4">{{ character.name }}</h1>
                        <p class="text-3xl text-paynes_gray-400">{{ character.country }}</p>
                    </div>

                    <div class="flex flex-col md:flex-row gap-12">
                        <div class="md:w-auto">
                            <h2 class="text-4xl font-semibold mb-6 text-air_superiority_blue-400 border-b-2 border-air_superiority_blue-400 pb-2">
                                Base Stats</h2>
                            <ul class="space-y-4">
                                <li *ngFor="let stat of getStatsArray(character.base)"
                                    class="flex justify-between items-center">
                                    <span class="text-2xl font-bold text-paynes_gray-400 capitalize mr-4">{{ stat[0] }}</span>
                                    <span class="text-3xl font-bold">{{ stat[1] }}</span>
                                </li>
                            </ul>
                        </div>
                        <div class="md:w-auto">
                            <h2 class="text-4xl font-semibold mb-6 text-air_superiority_blue-400 border-b-2 border-air_superiority_blue-400 pb-2">
                                Growth Stats</h2>
                            <ul class="space-y-4">
                                <li *ngFor="let stat of getStatsArray(character.growth)"
                                    class="flex justify-between items-center">
                                    <span class="text-2xl font-bold text-paynes_gray-400 capitalize mr-4">{{ stat[0] }}</span>
                                    <span class="text-3xl font-bold"
                                          [ngClass]="getGrowthStatClass(stat[0], stat[1])">
                                        {{ stat[1] }}%
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </ng-container>
            </div>
        </div>
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
export class CharacterDetailComponent {
  public character$: Observable<Character | undefined>;
  protected readonly CHARACTER_RESOURCE_PATH: string = CHARACTER_RESOURCE_PATH;

  constructor(
        private route: ActivatedRoute,
        private characterService: CharacterService
  ) {
    this.character$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        const name: string | null = params.get('name');
        return this.characterService.getCharacterByName(name || '');
      })
    );
  }

  getStatsArray(stats: StatSheet): [string, number][] {
    return Object.entries(stats).map(([key, value]) => [key, Number(value)]);
  }

  getGrowthStatClass(statName: string, value: number): string {
    if (statName === 'mov') {
      return 'text-mauve-500';
    } // No color effect for mov
    if (statName === 'bld') {
      return this.getBuildStatClass(value);
    }
    if (statName === 'hp') {
      return this.getHPStatClass(value);
    }
    return this.getDefaultStatClass(value);
  }

  private getBuildStatClass(value: number): string {
    const buildColors = ['text-purple-500', 'text-red-500', 'text-yellow-500', 'text-green-500', 'text-blue-500'];
    const index = [0, 5, 10, 15, 20].indexOf(value);
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
