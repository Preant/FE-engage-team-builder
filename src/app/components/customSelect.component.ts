import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Signal,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export type SelectOption<T> = {
    id: T;
    name: string;
    iconUrl: string;
}

@Component({
    selector: 'app-custom-select',
    imports: [CommonModule, FormsModule],
    animations: [
        trigger('dropdownAnimation', [
            state('void', style({
                transform: 'translateY(-8px)',
                opacity: 0
            })),
            state('*', style({
                transform: 'translateY(0)',
                opacity: 1
            })),
            transition(':enter', [
                animate('200ms ease-out')
            ]),
            transition(':leave', [
                animate('150ms ease-in')
            ])
        ])
    ],
    template: `
        <div class="relative">
            <!-- Main Select Button -->
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
                        [@dropdownAnimation]
                        class="absolute z-50 w-64 mt-2 bg-gradient-to-br from-gunmetal-400/95 to-gunmetal-600/95 border border-rich_black-500 rounded-lg shadow-lg backdrop-blur-sm"
                        (keydown.escape)="closeDropdown()"
                >
                    <!-- Search Input -->
                    <div class="p-2 border-b border-rich_black-500">
                        <input
                                #searchInput
                                type="text"
                                [(ngModel)]="searchQuery"
                                (input)="onSearchInput($event)"
                                (click)="$event.stopPropagation()"
                                placeholder="Search..."
                                class="w-full px-3 py-2 bg-gunmetal-500/50 text-baby_powder-500 rounded-md border border-rich_black-500 focus:outline-none focus:ring-2 focus:ring-forest_green-500 placeholder-gunmetal-300"
                        />
                    </div>

                    <!-- Options List -->
                    <div class="py-2 max-h-60 overflow-y-auto scrollbar-hide">
                        @if (filteredOptions().length === 0) {
                            <div class="px-4 py-2 text-gunmetal-300 text-center">
                                No results found
                            </div>
                        } @else {
                            @for (option of filteredOptions(); track option.id) {
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

        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
    `]
})
export class CustomSelectComponent<T> {
    @ViewChild('searchInput') searchInput!: ElementRef;
    @Input() options: SelectOption<T>[] = [];
    @Input() placeholder: string = 'Select an option';
    @Input({ required: true }) selectedId: number | string | null = null;
    @Input() selectedOption: SelectOption<T> | null = null;
    @Output() selectionChange: EventEmitter<SelectOption<T>> = new EventEmitter<SelectOption<T>>();
    searchQuery: string = '';
    private displayOptionSignal: WritableSignal<SelectOption<T> | null> = signal<SelectOption<T> | null>(null);
    displayOption: Signal<SelectOption<T> | null> = this.displayOptionSignal.asReadonly();
    private isOpenSignal: WritableSignal<boolean> = signal(false);
    isOpen: Signal<boolean> = this.isOpenSignal.asReadonly();
    private searchQuerySignal: WritableSignal<string> = signal('');

    filteredOptions = computed(() => {
      const query = this.searchQuerySignal().toLowerCase().trim();
      if (!query) {
        return this.options;
      }

      return this.options.filter(option =>
        option.name.toLowerCase().includes(query)
      );
    });

    constructor(private elementRef: ElementRef) {
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      if (!this.elementRef.nativeElement.contains(event.target)) {
        this.closeDropdown();
      }
    }

    @HostListener('document:keydown.escape', ['$event'])
    onEscapePressed(event: KeyboardEvent) {
      if (this.isOpen()) {
        this.closeDropdown();
        event.preventDefault();
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
      if (!this.isOpen()) {
        this.resetSearch();
      } else {
        setTimeout(() => {
          this.searchInput?.nativeElement?.focus();
        });
      }
    }

    closeDropdown(): void {
      this.isOpenSignal.set(false);
      this.resetSearch();
    }

    selectOption(option: SelectOption<T>): void {
      this.displayOptionSignal.set(option);
      this.selectionChange.emit(option);
      this.closeDropdown();
    }

    onSearchInput(event: Event): void {
      const input = event.target as HTMLInputElement;
      this.searchQuerySignal.set(input.value);
    }

    private resetSearch(): void {
      this.searchQuery = '';
      this.searchQuerySignal.set('');
    }
}
