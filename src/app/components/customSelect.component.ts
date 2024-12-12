import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Signal,
  signal,
  ViewChild
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export type SelectOption<T> = {
    id: T;
    name: string;
    iconUrl: string;
    borderColor: string;
}

export type OptionsProvider<T> = () => Promise<SelectOption<T>[]> | SelectOption<T>[];

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
                                class="h-10 w-10 rounded-full object-cover transition-colors duration-300"
                                [style.border]="'2px solid ' + option.borderColor"
                        />
                    } @else {
                        <div class="w-10 h-10 rounded-full bg-gunmetal-500 flex items-center justify-center border-2 border-gunmetal-500">
                            <span class="text-gunmetal-300 text-2xl">+</span>
                        </div>
                    }
                </div>
            </div>


            <!-- Dropdown Options -->
            @if (isOpen()) {
                <div
                        [@dropdownAnimation]
                        class="absolute z-10 w-64 mt-2 bg-gradient-to-br from-gunmetal-400/95 to-gunmetal-600/95 border border-rich_black-500 rounded-lg shadow-lg backdrop-blur-sm"
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
                        @if (loading()) {
                            <div class="px-4 py-2 text-gunmetal-300 text-center">
                                Loading...
                            </div>
                        } @else if (filteredOptions().length === 0) {
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
                                            class="w-8 h-8 rounded-full object-cover"
                                            [style.border]="'2px solid ' + option.borderColor"
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
  standalone: true,
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
    @Input({ required: true }) optionsProvider!: OptionsProvider<T>;
    @Output() selectionChange = new EventEmitter<SelectOption<T>>();

    searchQuery = '';
    private readonly displayOptionSignal = signal<SelectOption<T> | null>(null);
    displayOption = this.displayOptionSignal.asReadonly();

    private readonly isOpenSignal = signal(false);
    isOpen = this.isOpenSignal.asReadonly();

    private readonly searchQuerySignal = signal('');
    private readonly optionsSignal = signal<SelectOption<T>[]>([]);
    filteredOptions: Signal<SelectOption<T>[]> = computed(() => {
      const query = this.searchQuerySignal().toLowerCase().trim();
      const options = this.optionsSignal();

      if (!query) {
        return options;
      }

      return options.filter(option =>
        option.name.toLowerCase().includes(query)
      );
    });
    private readonly loadingSignal = signal(false);
    loading = this.loadingSignal.asReadonly();

    constructor(private elementRef: ElementRef) {
      effect(() => {
        const options = this.optionsSignal();
        const currentId = this.displayOption()?.id;

        if (currentId) {
          const selectedOption = options.find(opt => opt.id === currentId);
          this.displayOptionSignal.set(selectedOption ?? null);
        }
      });
    }

    async loadOptions() {
      this.loadingSignal.set(true);
      try {
        const options = await this.optionsProvider();
        this.optionsSignal.set(options);
      } catch (error) {
        console.error('Error loading options:', error);
        this.optionsSignal.set([]);
      } finally {
        this.loadingSignal.set(false);
      }
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

    async toggleDropdown() {
      const newIsOpen = !this.isOpen();
      this.isOpenSignal.set(newIsOpen);

      if (newIsOpen) {
        await this.loadOptions();

        setTimeout(() => {
          this.searchInput?.nativeElement?.focus();
        });
      } else {
        this.resetSearch();
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
