import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export type CarouselItem = {
    id: number;
    label: string;
    imageUrl: string;
}

@Component({
    selector: 'app-carousel',
    imports: [CommonModule],
    template: `
        <div class="border-2 border-rich_black-500 rounded-lg bg-gradient-to-br from-gunmetal-400/50 to-gunmetal-600/50 backdrop-blur-sm">
            <div
                    class="w-full overflow-x-auto scrollbar-hide"
                    (wheel)="handleWheel($event)">
                <div class="flex gap-4 p-4">
                    @for (item of items; track item.id) {
                        <div class="flex flex-col items-center gap-2 group">
                            <div
                                    [class]="'flex-shrink-0 cursor-pointer transform transition-all duration-300 rounded-full ' +
                          (selectedId === item.id ? 'scale-110 ring-4 ring-forest_green-500' : 'hover:scale-105')"
                                    (click)="selectItem(item.id)">
                                <div class="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-rich_black-600 to-gunmetal-500">
                                    <img
                                            [src]="item.imageUrl"
                                            [alt]="item.label"
                                            class="w-full h-full object-cover transform scale-105 image-rendering-smooth"
                                            loading="lazy"
                                            draggable="false"
                                    />
                                </div>
                            </div>
                            <span
                                    class="text-sm text-baby_powder whitespace-nowrap font-medium opacity-0 transform -translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0"
                                    [class.text-forest_green-500]="selectedId === item.id">
                                {{ item.label }}
                            </span>
                        </div>
                    }
                </div>
            </div>
        </div>
    `,
    styles: [`
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }

        .image-rendering-smooth {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            transform: translateZ(0);
            perspective: 1000;
            filter: brightness(1.02);
        }
    `]
})
export class CarouselComponent {
    @Input({ required: true }) items: CarouselItem[] = [];
    @Output() itemSelected = new EventEmitter<number>();

    selectedId: number | null = null;

    handleWheel(event: WheelEvent): void {
      if (event.deltaY !== 0) {
        event.preventDefault();
        const container = event.currentTarget as HTMLElement;
        container.scrollLeft += event.deltaY;
      }
    }

    selectItem(id: number): void {
      this.selectedId = id;
      this.itemSelected.emit(id);
    }
}
