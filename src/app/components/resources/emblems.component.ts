import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, Signal, WritableSignal } from '@angular/core';

import { CarouselComponent, CarouselItem } from '@/app/components/carousel.component';
import { EmblemDetailComponent } from '@/app/components/resources/details/emblem-detail.component';
import { Emblem } from '@/app/models/Emblem.model';
import { ImageType } from '@/app/models/ImageSize.enum';
import { AssetsService } from '@/app/services/assets.service';
import { EmblemService } from '@/app/services/resources.service';
import { ViewStateService } from '@/app/services/view-state.service';

@Component({
  selector: 'app-emblems',
  standalone: true,
  imports: [
    CommonModule,
    CarouselComponent,
    EmblemDetailComponent
  ],
  template: `
        <div class="w-full h-full flex flex-col p-6 bg-gradient-to-br from-prussian_blue-400 to-rich_black-600">
            <!-- Carousel -->
            <app-carousel
                    [items]="carouselItems()"
                    (itemSelected)="handleItemSelected($event)"
            />

            <!-- Emblem Detail -->
            @if (selectedEmblem(); as emblem) {
                <emblem-detail class="h-full mt-8" [emblem]="emblem"/>
            }
        </div>
    `
})
export class EmblemsComponent {
  protected selectedEmblem: WritableSignal<Emblem | null> = signal(null);

  private assetsService: AssetsService = inject(AssetsService);
  private emblemService: EmblemService = inject(EmblemService);
  readonly carouselItems: Signal<CarouselItem[]> = computed(() =>
    this.emblemService.resources().map(emblem => ({
      id: emblem.id,
      label: emblem.name,
      imageUrl: this.assetsService.getEmblemImage(emblem.identifier, ImageType.BODY_SMALL)
    }))
  );
  private viewStateService: ViewStateService = inject(ViewStateService);

  constructor() {
    effect(() => {
      const selectedId = this.viewStateService.getSelectedEmblemId()();
      if (selectedId !== null) {
        const emblem = this.emblemService.resources()
          .find(emblem => emblem.id === selectedId);
        if (emblem) {
          this.selectedEmblem.set(emblem);
        }
        this.viewStateService.setSelectedEmblemId(null);
      }
    });
  }

  protected handleItemSelected(id: number): void {
    const emblem = this.emblemService.resources()
      .find(emblem => emblem.id === id);
    if (emblem) {
      this.selectedEmblem.set(emblem);
    }
  }
}
