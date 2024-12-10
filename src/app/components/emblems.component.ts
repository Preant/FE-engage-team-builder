import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';

import { CarouselComponent, CarouselItem } from '@/app/components/carousel.component';
import { EmblemDetailComponent } from '@/app/components/emblem-detail.component';
import { Emblem } from '@/app/models/Emblem.model';
import { ImageSize } from '@/app/models/ImageSize.enum';
import { AssetsService } from '@/app/services/assets.service';
import { EmblemService } from '@/app/services/resources.service';

@Component({
    selector: 'app-emblems',
    imports: [
        CarouselComponent,
        EmblemDetailComponent
    ],
    template: `
        <div class="min-h-screen p-6 bg-gradient-to-br from-prussian_blue-400 to-rich_black-600">
            <div class="space-y-6">
                <app-carousel
                        [items]="getCarouselItems()"
                        (itemSelected)="handleItemSelected($event)"/>

                @if (selectedEmblem(); as emblem) {
                    <div class="mt-8 fade-in">
                        <emblem-detail [emblem]="emblem"/>
                    </div>
                }
            </div>
        </div>
    `,
    styles: [`
        :host {
            display: block;
            min-height: 100vh;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .fade-in {
            animation: fadeIn 0.5s ease-out;
        }
    `]
})
export class EmblemsComponent {
  selectedEmblem: WritableSignal<Emblem | null> = signal(null);
  private assetsService: AssetsService = inject(AssetsService);
  private emblemService: EmblemService = inject(EmblemService);
  private emblemsSignal: Signal<Emblem[]> = this.emblemService.getResources();

  getCarouselItems(): CarouselItem[] {
    return this.emblemsSignal().map((emblem: Emblem) => ({
      id: emblem.id,
      label: emblem.name,
      imageUrl: this.assetsService.getEmblemImage(
        emblem.identifier,
        emblem.secondaryIdentifier,
        ImageSize.SMALL
      )
    }));
  }

  handleItemSelected(id: number): void {
    const emblem: Emblem | undefined = this.emblemsSignal().find((emblem: Emblem) => emblem.id === id);
    if (emblem) {
      this.selectedEmblem.set(emblem);
    }
  }
}
