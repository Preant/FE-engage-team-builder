import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AssetsService } from '@/app/services/assets.service';
import { EmblemService } from '@/app/services/emblem.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
        <div class="w-full h-full bg-gradient-to-br from-rich_black-500 to-gunmetal-500 flex items-center justify-center overflow-auto">
            <div class="min-h-[900px] w-full flex items-center justify-center p-8">
                <div class="relative w-[800px] h-[800px] animate-fade-in">
                    <div class="absolute inset-0">
                        @for (emblem of emblems(); track emblem.id) {
                            <div
                                    [style.left]="getPositionX(emblem.id)"
                                    [style.top]="getPositionY(emblem.id)"
                                    class="absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 group hover:scale-110"
                            >
                                <a
                                        [routerLink]="['/emblems', emblem.resourceIdentifier]"
                                        class="block w-full h-full rounded-full overflow-hidden border-2 border-baby_powder-500 hover:border-forest_green-500 transition-colors duration-300 bg-gunmetal-600"
                                >
                                    <div class="w-full h-full flex items-center justify-center">
                                        <img
                                                [src]="getEmblemImage(emblem.resourceIdentifier)"
                                                [alt]="emblem.name"
                                                class="w-full h-full object-cover"
                                        />
                                    </div>
                                </a>
                                <div
                                        class="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded-full bg-gunmetal-600 text-baby_powder-500
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm
                  text-sm font-medium whitespace-nowrap z-10"
                                >
                                    {{ emblem.name }}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    `,
  styles: [`
        :host {
            display: block;
            width: 100%;
            height: 100%;
        }

        @keyframes fade-in {
            from {
                opacity: 0;
                transform: scale(0.9);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
        }
    `]
})
export class EmblemsPageComponent {
  private emblemService = inject(EmblemService);
  public emblems = this.emblemService.getEmblems();
  private assetsService = inject(AssetsService);

  getPositionX(index: number): string {
    const totalEmblems = this.emblems().length;
    const radius = 350;
    const angleOffset = -Math.PI / 2;
    const angle = angleOffset + (index * 2 * Math.PI) / totalEmblems;
    const x = radius * Math.cos(angle);

    // Convert to percentage of parent container width
    const centerX = 400; // Half of container width (800px)
    const posX = centerX + x;

    return `${posX}px`;
  }

  getPositionY(index: number): string {
    const totalEmblems = this.emblems().length;
    const radius = 350;
    const angleOffset = -Math.PI / 2;
    const angle = angleOffset + (index * 2 * Math.PI) / totalEmblems;
    const y = radius * Math.sin(angle);

    const centerY = 400;
    const posY = centerY + y;

    return `${posY}px`;
  }

  getEmblemImage(emblemIdentifier: string): string {
    return this.assetsService.getEmblemImage(emblemIdentifier);
  }
}

@Component({
  selector: 'app-emblem-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div *ngIf="emblem(); else loading" class="p-4">
            <h1 class="text-2xl font-bold text-baby_powder-500">{{ emblem()?.name }}</h1>
            <img
                    *ngIf="emblem()"
                    [src]="getEmblemImage(emblem()?.resourceIdentifier || '')"
                    [alt]="emblem()?.name"
                    class="w-48 h-48 object-cover rounded-lg mt-4"
            />
        </div>
        <ng-template #loading>
            <div class="p-4 text-baby_powder-500">Loading...</div>
        </ng-template>
    `
})
export class EmblemDetailComponent {
  private emblemService = inject(EmblemService);
  private assetsService = inject(AssetsService);
  private _resourceIdentifier!: string;

    @Input() set resourceIdentifier(value: string) {
    this._resourceIdentifier = value;
  }

    emblem = computed(() =>
      this.emblemService.getEmblemByName(this._resourceIdentifier)
    );

    getEmblemImage(emblemIdentifier: string): string {
      return this.assetsService.getEmblemImage(emblemIdentifier);
    }
}
