import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';

import { ClassCardComponent } from '@/app/components/resources/class-card.component';
import { ClassFiltersComponent } from '@/app/components/resources/class-filter.component';
import { Class } from '@/app/models/Class.model';
import { ClassType } from '@/app/models/ClassType.enum';
import { WeaponType } from '@/app/models/WeaponType.enum';
import { ClassService } from '@/app/services/resources.service';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectButtonModule,
    ClassCardComponent,
    ClassFiltersComponent
  ],
  template: `
        <div class="w-full h-full flex flex-col p-6 bg-gradient-to-br from-prussian_blue-400 to-rich_black-600">
            <!-- View Type and Filters Section -->
            <div class="mb-6">
                <app-class-filters (filterChange)="updateFilters($event)"/>
            </div>

            <!-- Classes Grid -->
            <div class="overflow-y-auto flex-1">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    @for (class of filteredClasses(); track class.id) {
                        <app-class-card [class]="class"/>
                    }
                </div>
            </div>
        </div>
    `
})
export class ClassesComponent {
  private filters = signal({
    classTypes: new Set<ClassType>(),
    weaponTypes: new Set<WeaponType>(),
    isAdvanced: null as boolean | null,
    searchQuery: ''
  });

  private classService: ClassService = inject(ClassService);

  protected readonly filteredClasses: Signal<Class[]> = computed(() => {
    const currentFilters = this.filters();

    return this.classService.resources()
      .filter(classItem => {
        // Apply class type filter
        if (currentFilters.classTypes.size > 0 &&
                    !currentFilters.classTypes.has(classItem.type)) {
          return false;
        }

        // Apply weapon type filter
        if (currentFilters.weaponTypes.size > 0 &&
                    !classItem.weapons.some(([type]) => currentFilters.weaponTypes.has(type))) {
          return false;
        }

        // Apply advanced/basic filter
        if (currentFilters.isAdvanced !== null &&
                    classItem.isAdvanced !== currentFilters.isAdvanced) {
          return false;
        }

        // Apply search filter
        return !(currentFilters.searchQuery &&
                    !classItem.name.toLowerCase().includes(currentFilters.searchQuery.toLowerCase()));


      });
  });

  protected updateFilters(newFilters: any): void {
    this.filters.set(newFilters);
  }
}
