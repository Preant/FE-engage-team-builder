import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, Signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { SelectButtonModule } from 'primeng/selectbutton';

import { CarouselComponent, CarouselItem } from '@/app/components/carousel.component';
import { WeaponDetailComponent } from '@/app/components/resources/details/weapon-detail.component';
import { ImageType } from '@/app/models/ImageSize.enum';
import { WeaponFilterType } from '@/app/models/weapon-filter-type.model';
import { Weapon } from '@/app/models/Weapon.model';
import { WeaponType } from '@/app/models/WeaponType.enum';
import { AssetsService } from '@/app/services/assets.service';
import { WeaponService } from '@/app/services/resources.service';
import { ViewStateService } from '@/app/services/view-state.service';

@Component({
  selector: 'app-weapons',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectButtonModule,
    DividerModule,
    CarouselComponent,
    WeaponDetailComponent
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

                <!-- Weapon Type Filters -->
                <div class="flex flex-wrap gap-2">
                    @for (type of weaponTypeOptions; track type.value) {
                        <div
                                class="flex items-center px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200"
                                [class.bg-rich_black-500]="!selectedWeaponTypes().includes(type.value)"
                                [class.bg-air_superiority_blue-500]="selectedWeaponTypes().includes(type.value)"
                                (click)="toggleWeaponType(type.value)"
                        >
                            <img
                                    [src]="getWeaponTypeIcon(type.value)"
                                    [alt]="type.label"
                                    class="w-5 h-5 mr-2"
                            />
                            <span
                                    class="text-sm"
                                    [class.text-paynes_gray-300]="!selectedWeaponTypes().includes(type.value)"
                                    [class.text-baby_powder-500]="selectedWeaponTypes().includes(type.value)"
                            >
                {{ type.label }}
              </span>
                        </div>
                    }
                </div>
            </div>

            <!-- Carousel -->
            <app-carousel
                    [items]="carouselItems()"
                    (itemSelected)="handleItemSelected($event)"
            />

            <!-- Weapon Detail -->
            @if (selectedWeapon(); as weapon) {
                <weapon-detail class="h-full mt-8" [weapon]="weapon"/>
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
export class WeaponsComponent {
  protected selectedWeapon: WritableSignal<Weapon | null> = signal(null);
  protected selectedFilter: WritableSignal<WeaponFilterType> = signal(WeaponFilterType.ALL);
  protected selectedSort: WritableSignal<string> = signal('might');
  protected sortDirection: WritableSignal<'asc' | 'desc'> = signal('desc');
  protected selectedWeaponTypes: WritableSignal<WeaponType[]> = signal<WeaponType[]>([]);

  protected readonly filterOptions = [
    { label: 'All Weapons', value: WeaponFilterType.ALL },
    { label: 'Regular', value: WeaponFilterType.REGULAR },
    { label: 'Unique', value: WeaponFilterType.UNIQUE },
    { label: 'Engage', value: WeaponFilterType.ENGAGE }
  ];

  protected readonly sortOptions = [
    { label: 'Might', value: 'might' },
    { label: 'Hit', value: 'hit' },
    { label: 'Weight', value: 'weight' },
    { label: 'Price', value: 'price' }
  ];

  protected readonly weaponTypeOptions = [
    { label: 'Sword', value: WeaponType.SWORD },
    { label: 'Lance', value: WeaponType.LANCE },
    { label: 'Axe', value: WeaponType.AXE },
    { label: 'Bow', value: WeaponType.BOW },
    { label: 'Tome', value: WeaponType.TOME },
    { label: 'Dragonstone', value: WeaponType.DRAGONSTONE },
    { label: 'Blast', value: WeaponType.BLAST },
    { label: 'Art', value: WeaponType.ART },
    { label: 'Dagger', value: WeaponType.DAGGER }
  ];

  private assetsService = inject(AssetsService);
  private weaponService = inject(WeaponService);
  private viewStateService = inject(ViewStateService);

  private filteredWeapons: Signal<Weapon[]> = computed(() => {
    let weapons = this.weaponService.resources();

    // Apply category filters
    switch (this.selectedFilter()) {
      case WeaponFilterType.REGULAR:
        weapons = weapons.filter(w => !w.isUnique && !w.isEngageWeapon);
        break;
      case WeaponFilterType.UNIQUE:
        weapons = weapons.filter(w => w.isUnique);
        break;
      case WeaponFilterType.ENGAGE:
        weapons = weapons.filter(w => w.isEngageWeapon);
        break;
      default:
    }

    // Apply weapon type filters
    const selectedTypes = this.selectedWeaponTypes();
    if (selectedTypes.length > 0) {
      weapons = weapons.filter(w => selectedTypes.includes(w.weaponType));
    }

    // Apply sorting
    return [...weapons].sort((a, b) => {
      const multiplier = this.sortDirection() === 'asc' ? 1 : -1;
      const aValue = Number(a[this.selectedSort() as keyof Weapon]);
      const bValue = Number(b[this.selectedSort() as keyof Weapon]);
      return (aValue - bValue) * multiplier;
    });
  });

  readonly carouselItems: Signal<CarouselItem[]> = computed(() =>
    this.filteredWeapons().map(weapon => ({
      id: weapon.id,
      label: weapon.name,
      imageUrl: this.assetsService.getWeaponImage(weapon.identifier, ImageType.BODY_SMALL)
    }))
  );

  constructor() {
    effect(() => {
      const selectedId = this.viewStateService.getSelectedWeaponId()();
      if (selectedId !== null) {
        const weapon = this.weaponService.resources()
          .find(weapon => weapon.id === selectedId);
        if (weapon) {
          this.selectedWeapon.set(weapon);
        }
        this.viewStateService.setSelectedWeaponId(null);
      }
    });
  }

  protected handleItemSelected(id: number): void {
    const weapon = this.weaponService.resources()
      .find(weapon => weapon.id === id);
    if (weapon) {
      this.selectedWeapon.set(weapon);
    }
  }

  protected onFilterChange(): void {
    this.selectedWeapon.set(null);
  }

  protected onSortChange(): void {
    // Keep selection when sort changes
  }

  protected toggleSortDirection(): void {
    this.sortDirection.update(current => current === 'asc' ? 'desc' : 'asc');
  }

  protected toggleWeaponType(type: WeaponType): void {
    this.selectedWeaponTypes.update(current => {
      if (current.includes(type)) {
        return current.filter(t => t !== type);
      }
      return [...current, type];
    });
  }

  protected getWeaponTypeIcon(type: WeaponType): string {
    return this.assetsService.getWeaponTypeImage(type);
  }
}
