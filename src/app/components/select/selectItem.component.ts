import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type SelectItemOption<T> = {
    id: T;
    name: string;
    borderColor: string;
}

@Component({
  selector: 'app-select-item',
  imports: [CommonModule, FormsModule],
  standalone: true,
  template: `
        <div [ngClass]="['flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-forest_green-500/20 transition-colors duration-200']">
            <span class="text-baby_powder-500 rounded-full"
                  [style.border]="'2px solid ' + item.borderColor">{{ item.name }}</span>
        </div>
    `,
  styles: [``]
})
export class SelectItemComponent<T> {
    @Input() item!: SelectItemOption<T>;
}
