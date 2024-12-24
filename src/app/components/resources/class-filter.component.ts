import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';

import { ClassType } from '@/app/models/ClassType.enum';
import { WeaponType } from '@/app/models/WeaponType.enum';
import { AssetsService } from '@/app/services/assets.service';

@Component({
  selector: 'app-class-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    SelectButtonModule
  ],
  template: `
        <div class="bg-rich_black-500/30 p-4 rounded-lg space-y-4">
            <!-- Search -->
            <div class="w-full">
                <span class="p-input-icon-left w-full">
                  <input
                          type="text"
                          pInputText
                          [(ngModel)]="searchQuery"
                          (ngModelChange)="emitFilters()"
                          placeholder="Search classes..."
                          class="w-full bg-rich_black-500/50 border-rich_black-400"
                  />
                </span>
            </div>

            <!-- Advanced/Basic Filter -->
            <div>
                <p-selectButton
                        [options]="advancedOptions"
                        [(ngModel)]="isAdvanced"
                        (ngModelChange)="emitFilters()"
                        [multiple]="false"
                ></p-selectButton>
            </div>

            <!-- Class Types -->
            <div class="flex flex-wrap gap-2">
                @for (type of classTypes; track type) {
                    <div
                            class="flex items-center px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200"
                            [class.bg-rich_black-500]="!selectedClassTypes.has(type)"
                            [class.bg-air_superiority_blue-500]="selectedClassTypes.has(type)"
                            (click)="toggleClassType(type)"
                    >
            <span
                    class="text-sm"
                    [class.text-paynes_gray-300]="!selectedClassTypes.has(type)"
                    [class.text-baby_powder-500]="selectedClassTypes.has(type)"
            >
              {{ type }}
            </span>
                    </div>
                }
            </div>

            <!-- Weapon Types -->
            <div class="flex flex-wrap gap-2">
                @for (type of weaponTypes; track type) {
                    <div
                            class="flex items-center px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200"
                            [class.bg-rich_black-500]="!selectedWeaponTypes.has(type)"
                            [class.bg-air_superiority_blue-500]="selectedWeaponTypes.has(type)"
                            (click)="toggleWeaponType(type)"
                    >
                        <img
                                [src]="getWeaponTypeIcon(type)"
                                [alt]="type"
                                class="w-5 h-5 mr-2"
                        />
                        <span
                                class="text-sm"
                                [class.text-paynes_gray-300]="!selectedWeaponTypes.has(type)"
                                [class.text-baby_powder-500]="selectedWeaponTypes.has(type)"
                        >
              {{ type }}
            </span>
                    </div>
                }
            </div>
        </div>
    `
})
export class ClassFiltersComponent {
    @Output() filterChange: EventEmitter<any> = new EventEmitter<any>();
    protected searchQuery: string = '';
    protected isAdvanced: boolean | null = null;
    protected selectedClassTypes: Set<ClassType> = new Set<ClassType>();
    protected selectedWeaponTypes: Set<WeaponType> = new Set<WeaponType>();
    protected readonly classTypes: ClassType[] = Object.values(ClassType);
    protected readonly weaponTypes: WeaponType[] = Object.values(WeaponType);
    protected readonly advancedOptions = [
      { label: 'All', value: null },
      { label: 'Basic', value: false },
      { label: 'Advanced', value: true }
    ];
    private readonly assetsService: AssetsService = inject(AssetsService);

    protected toggleClassType(type: ClassType): void {
      if (this.selectedClassTypes.has(type)) {
        this.selectedClassTypes.delete(type);
      } else {
        this.selectedClassTypes.add(type);
      }
      this.emitFilters();
    }

    protected toggleWeaponType(type: WeaponType): void {
      if (this.selectedWeaponTypes.has(type)) {
        this.selectedWeaponTypes.delete(type);
      } else {
        this.selectedWeaponTypes.add(type);
      }
      this.emitFilters();
    }

    protected emitFilters(): void {
      this.filterChange.emit({
        classTypes: this.selectedClassTypes,
        weaponTypes: this.selectedWeaponTypes,
        isAdvanced: this.isAdvanced,
        searchQuery: this.searchQuery
      });
    }

    protected getWeaponTypeIcon(type: WeaponType): string {
      return this.assetsService.getWeaponTypeImage(type);
    }
}
