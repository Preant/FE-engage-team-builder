import { CommonModule } from '@angular/common';
import {
  booleanAttribute,
  Component,
  EventEmitter,
  HostListener,
  Input,
  model,
  ModelSignal,
  OnInit,
  Output
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { Select } from 'primeng/select';

import { SelectItemComponent } from '@/app/components/select/selectItem.component';

export enum SelectType {
    ICON = 'icon',
    LABEL = 'label',
}

export type SelectOptionLabel<T> = {
    id: T;
    name: string;
    borderColor: string;
    secondaryItemsUrl: string[];
}

export type SelectOptionIcon<T> = {
    id: T;
    name: string;
    borderColor: string;
    itemUrl: string;
    selectedItemUrl: string;
}

@Component({
  selector: 'app-select',
  imports: [CommonModule, Select, FormsModule, FloatLabel, SelectItemComponent],
  standalone: true,
  template: `
        @if (showDetailsButton && selectedItemModel()) {
            <button class="absolute p-2 text-white z-10 scale-150"
                    (click)="$event.stopPropagation(); detailsButtonClicked.emit()">+
            </button>
        }
        <p-float-label variant="on" class="w-full h-full">
            <p-select [options]="selectOptions" [(ngModel)]="selectedItemModel" optionLabel="name"
                      [filter]="true"
                      filterBy="name"
                      inputId="emblem_label"
                      class="w-full h-full">
                <ng-template #selectedItem let-selectedOption>
                    @if (type === SelectType.ICON) {
                        <img
                                [src]="selectedOption.selectedItemUrl"
                                [alt]="selectedOption.name"
                                class="w-full h-fit"
                        />
                    } @else if (type === SelectType.LABEL) {
                        <app-select-item [item]="selectedOption" class="h-full w-full flex"/>
                    }
                </ng-template>
                <ng-template let-options #item>
                    @if (type === SelectType.ICON) {
                        <div class="flex flex-col items-center">
                            <img
                                    [src]="options.itemUrl"
                                    [alt]="options.name"
                                    class="w-32 h-full rounded-lg border-4 border-rich_black-700"
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
    @Input() selectOptions!: SelectOptionLabel<T>[] | SelectOptionIcon<T>[];
    @Input() type!: SelectType;
    @Input() label!: string;
    @Input() initialSelection?: T | null;
    @Input({ transform: booleanAttribute }) showDetailsButton: boolean = false;
    @Output() detailsButtonClicked: EventEmitter<void> = new EventEmitter<void>();
    readonly SelectType: typeof SelectType = SelectType;
    selectedItemModel: ModelSignal<SelectOptionLabel<T> | SelectOptionIcon<T> | null> = model<SelectOptionLabel<T> | SelectOptionIcon<T> | null>(null);

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
