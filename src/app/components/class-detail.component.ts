import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

import { efficiencyIconComponent } from '@/app/components/icons/efficiency-icon.component';
import { Class } from '@/app/models/Class.model';
import { AssetsService } from '@/app/services/assets.service';

@Component({
  selector: 'app-class-detail',
  standalone: true,
  imports: [CommonModule, efficiencyIconComponent],
  template: `
        <div class="overflow-x-auto">
            <table class="w-full border-collapse bg-baby_powder">
                <thead>
                <tr class="bg-gunmetal text-baby_powder">
                    <th class="p-4 text-left">Name</th>
                    <th class="p-4 text-left">Type</th>
                    <th class="p-4 text-left">Weapons</th>
                    <th class="p-4 text-left">Weaknesses</th>
                    <th class="p-4 text-center">Advanced</th>
                    <th class="p-4 text-center">Evolved From</th>
                </tr>
                </thead>
                <tbody>
                <tr class="border-b border-gunmetal/20 hover:bg-baby_powder-200 transition-colors duration-200">
                    <td class="p-4 font-semibold">{{ classData.name }}</td>
                    <td class="p-4">{{ classData.type }}</td>
                    <td class="p-4">
                        <div class="flex flex-col gap-1">
                            @for (weapon of classData.weapons; track weapon) {
                                <span class="text-sm">
                    {{ weapon[0] }} - {{ weapon[1] }}
                  </span>
                            }
                        </div>
                    </td>
                    <td class="p-4">
                        <div class="flex gap-2 flex-wrap">
                            @for (weakness of classData.weakness; track weakness) {
                                <app-efficiency-icon [weakness]="weakness"/>
                            }
                        </div>
                    </td>
                    <td class="p-4 text-center">
              <span [class]="classData.isAdvanced ? 'text-forest_green' : 'text-gunmetal'">
                {{ classData.isAdvanced ? 'Yes' : 'No' }}
              </span>
                    </td>
                    <td class="p-4 text-center">
                        {{ classData.evolvedFrom ? 'Yes' : 'No' }}
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    `,
  styles: []
})
export class ClassDetailComponent {
    @Input({ required: true }) classData!: Class;
    private readonly assetsService: AssetsService = inject(AssetsService);
}
