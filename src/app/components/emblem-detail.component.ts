import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, Signal, signal, WritableSignal } from '@angular/core';

import { Emblem } from '@/app/models/Emblem.model';
import { ImageSize } from '@/app/models/ImageSize.enum';
import { AssetsService } from '@/app/services/assets.service';

@Component({
  selector: 'emblem-detail',
  standalone: true,
  imports: [CommonModule],
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
                        {{ emblem.name }}
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
                                        class="text-mauve-500">{{ emblem.resourceIdentifier }}</span>
                                </p>
                                @if (emblem.secondaryResourceIdentifier) {
                                    <p class="text-2xl text-paynes_gray-400">
                                        Secondary Identifier: <span
                                            class="text-mauve-500">{{ emblem.secondaryResourceIdentifier }}</span>
                                    </p>
                                }
                            </div>
                        </div>
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
export class EmblemDetailComponent {
  private emblemSignal: WritableSignal<Emblem> = signal({} as Emblem);
  private assetsService: AssetsService = inject(AssetsService);

  public emblemImageUrl: Signal<string> = computed((): string =>
    this.assetsService.getEmblemImage(
      this.emblemSignal().resourceIdentifier,
      this.emblemSignal().secondaryResourceIdentifier,
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
}
