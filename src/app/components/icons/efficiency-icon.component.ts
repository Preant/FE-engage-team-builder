import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { EfficiencyType } from '@/app/models/EfficiencyType.enum';
import { AssetsService } from '@/app/services/assets.service';

@Component({
  selector: 'app-efficiency-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
        <img [src]="this.efficiencyTypeImage(weakness)" alt="{{ weakness }}"
             class="w-6 h-6"/>
    `,
  styles: []
})
export class efficiencyIconComponent {
    @Input() weakness!: EfficiencyType;
    private readonly assetsService: AssetsService = inject(AssetsService);


    public efficiencyTypeImage(efficiencyType: EfficiencyType): string {
      return this.assetsService.getEfficiencyTypeImage(efficiencyType);
    }
}
