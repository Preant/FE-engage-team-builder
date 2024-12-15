import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, model, ModelSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';

import { SelectItemComponent } from '@/app/components/select/selectItem.component';
import { SelectItemWithIconComponent } from '@/app/components/select/selectItemWithIcon.component';

@Component({
  selector: 'app-select',
  imports: [CommonModule, Select, SelectItemWithIconComponent, FormsModule, FloatLabel, SelectItemComponent],
  standalone: true,
  template: `
        <p-float-label variant="on">
            <p-select [options]="selectOptions" [(ngModel)]="selectedItemModel" optionLabel="name"
                      [filter]="true"
                      filterBy="name"
                      inputId="emblem_label"
                      class="w-full md:w-36 md:h-20">
                <ng-template #selectedItem let-selectedOption>
                    @if (withIcon) {
                        <app-select-item-with-icon [item]="selectedOption" [shouldDisplayLabel]="false"/>
                    } @else {
                        <app-select-item [item]="selectedOption"/>
                    }

                </ng-template>
                <ng-template let-options #item>
                    @if (withIcon) {
                        <app-select-item-with-icon [item]="options"/>
                    } @else {
                        <app-select-item [item]="options"/>
                    }
                </ng-template>
            </p-select>
            <label for="emblem_label">{{ label }}</label>
        </p-float-label>

    `,
  styles: [``]
})
export class SelectComponent<T> {
    @Input() selectOptions!: T[];
    @Input() label!: string;
    @Input() withIcon: boolean = true;
    selectedItemModel: ModelSignal<T | null> = model<T | null>(null);

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent) {
      event.preventDefault();
      this.selectedItemModel.set(null);
    }
}
