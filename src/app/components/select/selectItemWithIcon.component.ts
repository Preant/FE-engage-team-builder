import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type SelectItemIconOption<T> = {
    id: T;
    name: string;
    iconUrl: string;
    borderColor: string;
}


@Component({
  selector: 'app-select-item-with-icon',
  imports: [CommonModule, FormsModule],
  standalone: true,
  template: `
        <div [ngClass]="['flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-forest_green-500/20 transition-colors duration-200']">
            <img
                    [src]="item.iconUrl"
                    [alt]="item.name"
                    class="w-8 h-8 rounded-full object-cover"
                    [style.border]="'2px solid ' + item.borderColor"
            />
            @if (shouldDisplayLabel) {
                <span class="text-baby_powder-500">{{ item.name }}</span>
            }
        </div>
    `,
  styles: [``]
})
export class SelectItemWithIconComponent<T> {
    @Input() item!: SelectItemIconOption<T>;
    @Input() shouldDisplayLabel: boolean = true;
}
