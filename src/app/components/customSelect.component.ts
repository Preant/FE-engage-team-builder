import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';

export type SelectOption = {
    id: number;
    name: string;
    iconUrl: string;
}

@Component({
  selector: 'app-custom-select',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div class="relative">
            <div
                    (click)="toggleDropdown()"
                    [ngClass]="[
          'flex items-center justify-between p-2 cursor-pointer bg-gradient-to-br from-gunmetal-400/50 to-gunmetal-600/50 border border-rich_black-500 rounded-lg hover:border-forest_green-500 transition-all duration-300 group',
          isOpen() ? 'ring-2 ring-forest_green-500' : ''
        ]"
            >
                <div class="flex items-center">
                    @if (displayOption(); as option) {
                        <img
                                [src]="option.iconUrl"
                                [alt]="option.name"
                                class="h-10 w-10 rounded-full object-cover ring-2 ring-gunmetal-500 group-hover:ring-forest_green-500 transition-colors duration-300"
                        />
                    } @else {
                        <div class="w-10 h-10 rounded-full bg-gunmetal-500 flex items-center justify-center">
                            <span class="text-gunmetal-300 text-2xl">+</span>
                        </div>
                    }
                </div>
            </div>

            <!-- Tooltip for Selected Option -->
            @if (displayOption(); as option) {
                <div
                        class="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-gunmetal-500/90 text-baby_powder-500 rounded text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                    {{ option.name }}
                </div>
            }

            <!-- Dropdown Options -->
            @if (isOpen()) {
                <div
                        class="absolute z-50 w-64 mt-2 bg-gradient-to-br from-gunmetal-400/95 to-gunmetal-600/95 border border-rich_black-500 rounded-lg shadow-lg backdrop-blur-sm animate-fadeIn"
                >
                    <div class="py-2 max-h-60 overflow-y-auto scrollbar-hide">
                        @for (option of options; track option.id) {
                            <div
                                    (click)="selectOption(option)"
                                    [ngClass]="[
                  'flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-forest_green-500/20 transition-colors duration-200',
                  displayOption()?.id === option.id ? 'bg-forest_green-500/30' : ''
                ]"
                            >
                                <img
                                        [src]="option.iconUrl"
                                        [alt]="option.name"
                                        class="w-8 h-8 rounded-full object-cover ring-2 ring-gunmetal-500"
                                />
                                <span class="text-baby_powder-500">{{ option.name }}</span>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    `,
  styles: [`
        :host {
            display: block;
        }

        .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-8px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
    `]
})
export class CustomSelectComponent {
    @Input() options: SelectOption[] = [];
    @Input() placeholder: string = 'Select an option';
    @Input({ required: true }) selectedId: number | string | null = null;
    @Input() selectedOption: SelectOption | null = null;  // New input for the selected option
    @Output() selectionChange: EventEmitter<SelectOption> = new EventEmitter<SelectOption>();

    private displayOptionSignal: WritableSignal<SelectOption | null> = signal<SelectOption | null>(null);
    displayOption: Signal<SelectOption | null> = this.displayOptionSignal.asReadonly();

    private isOpenSignal: WritableSignal<boolean> = signal(false);
    isOpen: Signal<boolean> = this.isOpenSignal.asReadonly();

    constructor(private elementRef: ElementRef) {
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.isOpenSignal.set(false);
      }
    }

    ngOnChanges() {
      if (this.selectedOption) {
        this.displayOptionSignal.set(this.selectedOption);
        return;
      }

      if (this.selectedId !== null) {
        const option = this.options.find(opt => opt.id === this.selectedId);
        this.displayOptionSignal.set(option || null);
      } else {
        this.displayOptionSignal.set(null);
      }
    }

    toggleDropdown(): void {
      this.isOpenSignal.update(value => !value);
    }

    selectOption(option: SelectOption): void {
      this.displayOptionSignal.set(option);
      this.selectionChange.emit(option);
      this.isOpenSignal.set(false);
    }
}
