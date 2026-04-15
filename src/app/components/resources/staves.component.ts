import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, Signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { SelectButtonModule } from 'primeng/selectbutton';

import { CarouselComponent, CarouselItem } from '@/app/components/carousel.component';
import { StaffDetailComponent } from '@/app/components/resources/details/staff-detail.component';
import { ImageType } from '@/app/models/ImageSize.enum';
import { Staff } from '@/app/models/Staff.model';
import { WeaponFilterType } from '@/app/models/weapon-filter-type.model';
import { AssetsService } from '@/app/services/assets.service';
import { StaffService } from '@/app/services/resources.service';
import { ViewStateService } from '@/app/services/view-state.service';

@Component({
  selector: 'app-staves',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectButtonModule,
    DividerModule,
    CarouselComponent,
    StaffDetailComponent
  ],
  template: `
        <div class="w-full h-full flex flex-col p-6 bg-gradient-to-br from-prussian_blue-400 to-rich_black-600">
            <!-- Filters -->
            <div class="flex flex-col gap-4 mb-4">
                <!-- Category Filters -->
                <div class="flex justify-between items-center">
                    <p-selectButton
                            [options]="filterOptions"
                            [(ngModel)]="selectedFilter"
                            [multiple]="false"
                            (onChange)="onFilterChange()"
                            [allowEmpty]="false"
                            optionLabel="label"
                            optionValue="value"
                    ></p-selectButton>

                    <div class="flex gap-2">
                        <p-button
                                [icon]="'pi pi-sort-up'"
                                (click)="toggleSortDirection()"
                                [outlined]="true"
                                [class]="'sort-button ' + (sortDirection() === 'asc' ? 'rotated' : '')"
                        ></p-button>
                        <p-selectButton
                                [options]="sortOptions"
                                [(ngModel)]="selectedSort"
                                [multiple]="false"
                                (onChange)="onSortChange()"
                                [allowEmpty]="false"
                                optionLabel="label"
                                optionValue="value"
                        ></p-selectButton>
                    </div>
                </div>
            </div>

            <!-- Carousel -->
            <app-carousel
                    [items]="carouselItems()"
                    (itemSelected)="handleItemSelected($event)"
            />

            <!-- Staff Detail -->
            @if (selectedStaff(); as staff) {
                <staff-detail class="h-full mt-8" [staff]="staff"/>
            }
        </div>
    `,
  styles: [`
        .sort-button {
            transition: transform 0.3s ease;
        }

        .sort-button.rotated {
            transform: rotate(180deg);
        }
    `]
})
export class StavesComponent {
  protected selectedStaff: WritableSignal<Staff | null> = signal(null);
  protected selectedFilter: WritableSignal<WeaponFilterType> = signal(WeaponFilterType.ALL);
  protected selectedSort: WritableSignal<string> = signal('heal');
  protected sortDirection: WritableSignal<'asc' | 'desc'> = signal('desc');

  protected readonly filterOptions = [
    { label: 'All Staves', value: WeaponFilterType.ALL },
    { label: 'Regular', value: WeaponFilterType.REGULAR },
    { label: 'Unique', value: WeaponFilterType.UNIQUE },
    { label: 'Engage', value: WeaponFilterType.ENGAGE }
  ];

  protected readonly sortOptions = [
    { label: 'Heal', value: 'heal' },
    { label: 'Hit', value: 'hit' },
    { label: 'Weight', value: 'weight' },
    { label: 'Price', value: 'price' }
  ];

  private assetsService = inject(AssetsService);
  private staffService = inject(StaffService);
  private viewStateService = inject(ViewStateService);

  private filteredStaves: Signal<Staff[]> = computed(() => {
    let staves = this.staffService.resources();

    // Apply category filters
    switch (this.selectedFilter()) {
      case WeaponFilterType.REGULAR:
        staves = staves.filter(s => !s.isUnique && !s.isEngageWeapon);
        break;
      case WeaponFilterType.UNIQUE:
        staves = staves.filter(s => s.isUnique);
        break;
      case WeaponFilterType.ENGAGE:
        staves = staves.filter(s => s.isEngageWeapon);
        break;
      default:
    }

    // Apply sorting
    return [...staves].sort((a, b) => {
      const multiplier = this.sortDirection() === 'asc' ? 1 : -1;
      const aValue = Number(a[this.selectedSort() as keyof Staff]);
      const bValue = Number(b[this.selectedSort() as keyof Staff]);
      return (aValue - bValue) * multiplier;
    });
  });

  readonly carouselItems: Signal<CarouselItem[]> = computed(() =>
    this.filteredStaves().map(staff => ({
      id: staff.id,
      label: staff.name,
      imageUrl: this.assetsService.getStaffImage(staff.identifier, ImageType.BODY_SMALL)
    }))
  );

  constructor() {
    effect(() => {
      const selectedId = this.viewStateService.getSelectedStaffId()();
      if (selectedId !== null) {
        const staff = this.staffService.resources()
          .find(staff => staff.id === selectedId);
        if (staff) {
          this.selectedStaff.set(staff);
        }
        this.viewStateService.setSelectedStaffId(null);
      }
    });
  }

  protected handleItemSelected(id: number): void {
    const staff = this.staffService.resources()
      .find(staff => staff.id === id);
    if (staff) {
      this.selectedStaff.set(staff);
    }
  }

  protected onFilterChange(): void {
    this.selectedStaff.set(null);
  }

  protected onSortChange(): void {
    // Keep selection when sort changes
  }

  protected toggleSortDirection(): void {
    this.sortDirection.update(current => current === 'asc' ? 'desc' : 'asc');
  }
}
