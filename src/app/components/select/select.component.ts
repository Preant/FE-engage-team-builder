import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, model, ModelSignal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';

import { SelectItemComponent } from '@/app/components/select/selectItem.component';

export enum SelectType {
    ICON = 'icon',
    LABEL = 'label',
}

export type SelectOption<T> = {
    id: T;
    name: string;
    borderColor: string;
}

export type SelectOptionIcon<T> = SelectOption<T> & {
    itemUrl: string;
    selectedItemUrl: string;
}

@Component({
  selector: 'app-select',
  imports: [CommonModule, Select, FormsModule, FloatLabel, SelectItemComponent],
  standalone: true,
  template: `
        <p-float-label variant="on">
            <p-select [options]="selectOptions" [(ngModel)]="selectedItemModel" optionLabel="name"
                      [filter]="true"
                      filterBy="name"
                      inputId="emblem_label"
                      class="w-full md:w-36 md:h-20">
                <ng-template #selectedItem let-selectedOption>
                    @if (type === SelectType.ICON) {
                        <img
                                [src]="selectedOption.selectedItemUrl"
                                [alt]="selectedOption.name"
                                class="w-full h-fit"
                        />
                    } @else if (type === SelectType.LABEL) {
                        <app-select-item [item]="selectedOption"/>
                    }
                </ng-template>
                <ng-template let-options #item>
                    @if (type === SelectType.ICON) {
                        <div class="flex flex-col items-center">
                            <img
                                    [src]="options.itemUrl"
                                    [alt]="options.name"
                                    class="w-full h-fit rounded-lg border-4 border-rich_black-700"
                                    [style]="{'border-color': options.borderColor}"
                            />
                            <span>{{ options.name }}</span>
                        </div>
                    } @else if (type === SelectType.LABEL) {
                        <app-select-item [item]="options"/>
                    }
                </ng-template>
            </p-select>
            <label for="emblem_label">{{ label }}</label>
        </p-float-label>
    `
})
export class SelectComponent<T> implements OnInit {
    @Input() selectOptions!: SelectOption<T>[] | SelectOptionIcon<T>[];
    @Input() type!: SelectType;
    @Input() label!: string;
    @Input() initialSelection?: T | null;
    readonly SelectType: typeof SelectType = SelectType;
    selectedItemModel: ModelSignal<SelectOption<T> | SelectOptionIcon<T> | null> = model<SelectOption<T> | SelectOptionIcon<T> | null>(null);

    ngOnInit() {
      if (this.initialSelection) {
        const initialOption = this.selectOptions.find(option => option.id === this.initialSelection);
        if (initialOption) {
          this.selectedItemModel.set(initialOption);
        }
      }
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent) {
      event.preventDefault();
      this.selectedItemModel.set(null);
    }
}
