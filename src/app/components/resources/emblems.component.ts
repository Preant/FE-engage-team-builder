import { Component, effect, inject, signal, WritableSignal } from '@angular/core';

import { CarouselComponent, CarouselItem } from '@/app/components/carousel.component';
import { EmblemDetailComponent } from '@/app/components/resources/details/emblem-detail.component';
import { Emblem } from '@/app/models/Emblem.model';
import { ImageType } from '@/app/models/ImageSize.enum';
import { AssetsService } from '@/app/services/assets.service';
import { EmblemService } from '@/app/services/resources.service';
import { ViewStateService } from '@/app/services/view-state.service';

@Component({
  selector: 'app-emblems',
  imports: [
    CarouselComponent,
    EmblemDetailComponent
  ],
  template: `
        <div class="w-full h-full flex flex-col p-6 bg-gradient-to-br from-prussian_blue-400 to-rich_black-600">
            <app-carousel
                    [items]="getCarouselItems()"
                    (itemSelected)="handleItemSelected($event)"
            />
            @if (selectedEmblem(); as emblem) {
                <emblem-detail class="h-full mt-8" [emblem]="emblem"/>
            }
        </div>
    `,
  standalone: true
})
export class EmblemsComponent {
  selectedEmblem: WritableSignal<Emblem | null> = signal(null);
  private assetsService: AssetsService = inject(AssetsService);
  private emblemService: EmblemService = inject(EmblemService);
  private viewStateService: ViewStateService = inject(ViewStateService);

  constructor() {
    effect(() => {
      const selectedId: number | null = this.viewStateService.getSelectedEmblemId()();
      if (selectedId !== null) {
        const emblem: Emblem | undefined = this.emblemService.resources()
          .find((emblem: Emblem) => emblem.id === selectedId);
        if (emblem) {
          this.selectedEmblem.set(emblem);
        }
        this.viewStateService.setSelectedEmblemId(null);
      }
    });
  }

  getCarouselItems(): CarouselItem[] {
    return this.emblemService.resources().map((emblem: Emblem) => ({
      id: emblem.id,
      label: emblem.name,
      imageUrl: this.assetsService.getEmblemImage(emblem.identifier, ImageType.BODY_SMALL)
    }));
  }

  handleItemSelected(id: number): void {
    const emblem: Emblem | undefined = this.emblemService.resources()
      .find((emblem: Emblem) => emblem.id === id);
    if (emblem) {
      this.selectedEmblem.set(emblem);
    }
  }
}
