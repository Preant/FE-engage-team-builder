import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  signal,
  ViewChild
} from '@angular/core';

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
                    #scrollContainer
                    class="w-full overflow-x-auto"
                    (wheel)="handleWheel($event)"
                    (scroll)="handleScroll()">
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
                        </div>
                    }
                </div>
            </div>

            <!-- Custom Scrollbar -->
            <div class="relative h-1 mx-4 mb-2">
                <!-- Track -->
                <div class="absolute w-full h-full rounded-full bg-rich_black-800">
                    <!-- Handle -->
                    <div
                            class="absolute h-full rounded-full transition-all duration-150 ease-out cursor-pointer bg-rich_black-400"
                            [style.width.%]="scrollbarWidth()"
                            [style.left.%]="scrollbarPosition()"
                            (mousedown)="startDragging($event)">
                    </div>
                </div>
            </div>
        </div>
    `,
  standalone: true,
  styles: [`
        :host {
            display: block;
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

        /* Hide default scrollbar for different browsers */
        :host ::ng-deep .overflow-x-auto {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE and Edge */
        }

        :host ::ng-deep .overflow-x-auto::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
        }
    `]
})
export class CarouselComponent implements AfterViewInit {
    @Input({ required: true }) items: CarouselItem[] = [];
    @Output() itemSelected = new EventEmitter<number>();
    @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

    selectedId: number | null = null;
    protected isDragging = signal(false);
    private scrollPosition = signal(0);
    private containerWidth = signal(0);
    private totalWidth = signal(0);
    private startX = 0;
    private scrollLeft = 0;

    constructor() {
      // Setup effect to recalculate dimensions when needed
      effect(() => {
        this.updateScrollbarDimensions();
      });

      // Add global mouse event listeners for drag handling
      window.addEventListener('mousemove', this.handleMouseMove.bind(this));
      window.addEventListener('mouseup', this.stopDragging.bind(this));
    }

    ngAfterViewInit(): void {
      this.updateScrollbarDimensions();
    }

    handleWheel(event: WheelEvent): void {
      if (event.deltaY !== 0) {
        event.preventDefault();
        const container = event.currentTarget as HTMLElement;
        container.scrollLeft += event.deltaY;
      }
    }

    handleScroll(): void {
      const container = this.scrollContainer.nativeElement;
      this.scrollPosition.set(container.scrollLeft);
      this.updateScrollbarDimensions();
    }

    selectItem(id: number): void {
      this.selectedId = id;
      this.itemSelected.emit(id);
    }

    scrollbarWidth(): number {
      if (this.totalWidth() === 0) {
        return 0;
      }
      return (this.containerWidth() / this.totalWidth()) * 100;
    }

    scrollbarPosition(): number {
      if (this.totalWidth() === 0) {
        return 0;
      }
      const maxScroll = this.totalWidth() - this.containerWidth();
      return maxScroll <= 0 ? 0 : (this.scrollPosition() / maxScroll) * (100 - this.scrollbarWidth());
    }

    startDragging(event: MouseEvent): void {
      this.isDragging.set(true);
      this.startX = event.pageX - this.scrollbarPosition();
      this.scrollLeft = this.scrollPosition();
    }

    handleMouseMove(event: MouseEvent): void {
      if (!this.isDragging()) {
        return;
      }

      event.preventDefault();
      const x = event.pageX - this.startX;
      const walk = (x * (this.totalWidth() - this.containerWidth())) /
            (this.containerWidth() * (100 - this.scrollbarWidth()) / 100);

      this.scrollContainer.nativeElement.scrollLeft = this.scrollLeft + walk;
    }

    stopDragging(): void {
      this.isDragging.set(false);
    }

    private updateScrollbarDimensions(): void {
      const container = this.scrollContainer.nativeElement;
      this.containerWidth.set(container.clientWidth);
      this.totalWidth.set(container.scrollWidth);
    }
}
