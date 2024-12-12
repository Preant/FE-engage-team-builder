import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, Signal, signal, WritableSignal } from '@angular/core';

import { Emblem } from '@/app/models/Emblem.model';
import { ImageSize } from '@/app/models/ImageSize.enum';
import { isItem } from '@/app/models/Item.model';
import { AssetsService } from '@/app/services/assets.service';
import { EmblemService } from '@/app/services/resources.service';

@Component({
  selector: 'emblem-detail',
  imports: [CommonModule],
  standalone: true,
  template: `
        <div class="min-h-screen w-full bg-rich_black-500 text-mauve-500 relative overflow-hidden">
            <div
                    class="absolute inset-0 bg-cover bg-center opacity-20"
                    [style.background-image]="'url(' + emblemImageUrl() + ')'"
            >
            </div>

            <div class="relative z-10 max-w-7xl mx-auto p-8">
                <div class="mb-12 text-left">
                    <h1 class="text-6xl font-bold text-air_superiority_blue-500 mb-4">
                        {{ currentEmblem().name }}
                    </h1>
                </div>

                <div class="flex flex-col md:flex-row gap-12">
                    <div class="md:w-2/3">
                        <div class="rounded-lg p-6">
                            <h2 class="text-4xl font-semibold mb-6 text-air_superiority_blue-400 border-b-2 border-air_superiority_blue-400 pb-2">
                                Emblem Details
                            </h2>
                            <div class="space-y-4">
                                <p class="text-2xl text-paynes_gray-400">
                                    Resource Identifier: <span
                                        class="text-mauve-500">{{ currentEmblem().identifier }}</span>
                                </p>
                                @if (currentEmblem().secondaryIdentifier) {
                                    <p class="text-2xl text-paynes_gray-400">
                                        Secondary Identifier: <span
                                            class="text-mauve-500">{{ currentEmblem().secondaryIdentifier }}</span>
                                    </p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                @if (engageWeapons().length > 0) {
                    <div class="mt-6">
                        <h3 class="text-xl font-semibold text-baby_powder-500 mb-4">
                            Engage Weapons
                        </h3>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                            @for (tool of engageTools(); track tool.id) {
                                <div
                                        class="bg-gradient-to-br from-gunmetal-400/50 to-gunmetal-600/50 p-4 rounded-lg border border-rich_black-500">
                                    <div class="flex items-center gap-3">
                                        <img
                                                [src]="isItem(tool) ? getItemImage(tool.identifier) : getWeaponImage(tool.identifier)"
                                                [alt]="tool.name"
                                                class="w-12 h-12 object-contain"
                                        />
                                        <div>
                                            <h4 class="text-baby_powder-500 font-medium">
                                                {{ tool.name }}
                                            </h4>
                                            <p class="text-sm text-gunmetal-200">
                                                {{ tool.description }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    `
})
export class EmblemDetailComponent {
  protected readonly isItem = isItem;
  private emblemSignal: WritableSignal<Emblem> = signal({} as Emblem);
  public currentEmblem: Signal<Emblem> = computed(() => this.emblemSignal());
  private readonly emblemService = inject(EmblemService);
  public engageWeapons = computed(() =>
    this.emblemService.getEngageWeapons(this.currentEmblem().id)()
  );
  public engageItems = computed(() =>
    this.emblemService.getEngageItems(this.currentEmblem().id)()
  );
  public engageTools = computed(() =>
    this.emblemService.getEmblemTools(this.currentEmblem().id)()
  );
  private readonly assetsService = inject(AssetsService);
  public emblemImageUrl = computed(() =>
    this.assetsService.getEmblemImage(
      this.currentEmblem().identifier,
      this.currentEmblem().secondaryIdentifier,
      ImageSize.LARGE
    )
  );

  get emblem(): Emblem {
    return this.emblemSignal();
  }

    @Input({ required: true })
  set emblem(value: Emblem) {
    this.emblemSignal.set(value);
  }

    getWeaponImage(weaponIdentifier: string): string {
      return this.assetsService.getWeaponImage(weaponIdentifier, ImageSize.SMALL);
    }

    getItemImage(itemIdentifier: string): string {
      return this.assetsService.getItemImage(itemIdentifier, ImageSize.SMALL);
    }
}
