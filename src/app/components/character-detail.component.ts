import { Component, Input } from '@angular/core';
import { Character } from "../models/Character.model";
import { CommonModule } from "@angular/common";
import { StatSheet } from "../models/StatSheet.model";

@Component({
    selector: 'character-detail',
    standalone: true,
    imports: [
        CommonModule
    ],
    template: `
        <div *ngIf="character"
             class="relative bg-gunmetal-500 text-baby_powder-500 p-6 rounded-lg shadow-lg max-w-2xl overflow-hidden">
            <div class="absolute inset-0 bg-cover bg-center opacity-20"
                 [style.background-image]="'url(' + character.image + ')'"></div>
            <div class="relative z-10">
                <div class="mb-6">
                    <h2 class="text-3xl font-bold text-forest_green-500">{{ character.name }}</h2>
                </div>

                <div class="grid grid-cols-2 gap-6">
                    <div class="bg-gunmetal-600 bg-opacity-70 p-4 rounded">
                        <h3 class="text-xl font-semibold mb-2 text-forest_green-400">Base Stats</h3>
                        <ul>
                            <li *ngFor="let stat of getStatsArray(character.base)" class="mb-1">
                                <span class="text-pakistan_green-400 capitalize">{{ stat[0] }}:</span> {{ stat[1] }}
                            </li>
                        </ul>
                    </div>
                    <div class="bg-gunmetal-600 bg-opacity-70 p-4 rounded">
                        <h3 class="text-xl font-semibold mb-2 text-forest_green-400">Growth Stats</h3>
                        <ul>
                            <li *ngFor="let stat of getStatsArray(character.growth)" class="mb-1">
                                <span class="text-pakistan_green-400 capitalize">{{ stat[0] }}:</span> {{ stat[1] }}%
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [``]
})
export class CharacterDetailComponent {
    @Input() character?: Character;

    constructor() {
    }

    getStatsArray(stats: StatSheet): [string, number][] {
        return Object.entries(stats).map(([key, value]) => [key, Number(value)]);
    }
}
