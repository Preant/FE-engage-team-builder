import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type SelectItemOption<T> = {
    id: T;
    name: string;
    secondaryItemsUrl: string[];
}

@Component({
  selector: 'app-select-item',
  imports: [CommonModule, FormsModule],
  standalone: true,
  template: `
        <div class="w-52 flex items-center gap-1 cursor-pointer hover:bg-forest_green-500/20 transition-colors duration-200">
            <div class="flex flex-col gap-1 w-6">
                @for (itemUrl of item.secondaryItemsUrl; track $index) {
                    <img [src]="itemUrl"
                         [alt]="item.name"
                         class="w-6 h-6 rounded-full"/>
                }
            </div>
            <span class="text-baby_powder-500 rounded-full whitespace-pre-wrap origin-left">
                {{ item.name }}
            </span>
        </div>
    `,
  styles: ``
})
export class SelectItemComponent<T> {
    @Input() item!: SelectItemOption<T>;
}
