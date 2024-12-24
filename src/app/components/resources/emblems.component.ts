import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, Signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';

import { CarouselComponent, CarouselItem } from '@/app/components/carousel.component';
import { EmblemDetailComponent } from '@/app/components/resources/details/emblem-detail.component';
import { Emblem } from '@/app/models/Emblem.model';
import { EmblemType } from '@/app/models/EmblemType.enum';
import { ImageType } from '@/app/models/ImageSize.enum';
import { AssetsService } from '@/app/services/assets.service';
import { EmblemService } from '@/app/services/resources.service';
import { ViewStateService } from '@/app/services/view-state.service';

export enum EmblemFilterType {
    ALL = 'ALL',
    TANK = 'TANK',
    BRUISER = 'BRUISER',
    SUPPORT = 'SUPPORT',
    DUELIST = 'DUELIST',
    SCOUT = 'SCOUT'
}

@Component({
  selector: 'app-emblems',
  standalone: true,
  imports: [
    CommonModule,
    CarouselComponent,
    EmblemDetailComponent,
    SelectButton,
    FormsModule
  ],
  template: `
        <div class="w-full h-full flex flex-col p-6 bg-gradient-to-br from-prussian_blue-400 to-rich_black-600">
            <div class="flex flex-col gap-4 mb-4">
                <!-- Emblem type Filter -->
                <p-selectButton
                        [options]="emblemFilterOptions"
                        [(ngModel)]="selectedEmblemFilter"
                        [multiple]="false"
                        [allowEmpty]="false"
                        optionLabel="label"
                        optionValue="value"
                ></p-selectButton>

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
  protected selectedEmblemFilter: WritableSignal<EmblemFilterType> = signal(EmblemFilterType.ALL);
  protected readonly emblemFilterOptions = [
    { label: 'All', value: EmblemFilterType.ALL },
    { label: 'Tank', value: EmblemFilterType.TANK },
    { label: 'Bruiser', value: EmblemFilterType.BRUISER },
    { label: 'Support', value: EmblemFilterType.SUPPORT },
    { label: 'Duelist', value: EmblemFilterType.DUELIST },
    { label: 'Scout', value: EmblemFilterType.SCOUT }
  ];
  private assetsService: AssetsService = inject(AssetsService);
  private emblemService: EmblemService = inject(EmblemService);
  private filteredEmblems: Signal<Emblem[]> = computed((): Emblem[] => {
    const emblems: Emblem[] = this.emblemService.resources();

    switch (this.selectedEmblemFilter()) {
      case EmblemFilterType.TANK:
        return emblems.filter((emblem: Emblem) => emblem.type === EmblemType.TANK);
      case EmblemFilterType.BRUISER:
        return emblems.filter((emblem: Emblem) => emblem.type === EmblemType.BRUISER);
      case EmblemFilterType.SUPPORT:
        return emblems.filter((emblem: Emblem) => emblem.type === EmblemType.SUPPORT);
      case EmblemFilterType.DUELIST:
        return emblems.filter((emblem: Emblem) => emblem.type === EmblemType.DUELIST);
      case EmblemFilterType.SCOUT:
        return emblems.filter((emblem: Emblem) => emblem.type === EmblemType.SCOUT);
      default:
        return emblems;
    }
  });
  readonly carouselItems: Signal<CarouselItem[]> = computed(() =>
    this.filteredEmblems().map((emblem: Emblem) => ({
      id: emblem.id,
      label: emblem.name,
      imageUrl: this.assetsService.getEmblemImage(emblem.identifier, ImageType.BODY_SMALL)
    }))
  );
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

  protected handleItemSelected(id: number): void {
    const emblem: Emblem | undefined = this.emblemService.resources()
      .find((emblem: Emblem) => emblem.id === id);
    if (emblem) {
      this.selectedEmblem.set(emblem);
    }
  }
}
