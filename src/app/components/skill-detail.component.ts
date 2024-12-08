import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Skill } from '@/app/models/Skill.model';
import { SkillType } from '@/app/models/SkillType.enum';

@Component({
  selector: 'skill-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div class="min-h-screen w-full bg-rich_black-500 text-mauve-500 relative overflow-hidden">
            <div class="relative z-10 max-w-7xl mx-auto p-8">
                <div class="mb-12 text-left">
                    <h1 class="text-6xl font-bold text-air_superiority_blue-500 mb-4">
                        {{ formatSkillType(skillType) }} Skills
                    </h1>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full border-collapse bg-gradient-to-br from-gunmetal-400/50 to-gunmetal-600/50 backdrop-blur-sm">
                        <thead class="bg-rich_black-500/50">
                        <tr>
                            <th class="p-4 text-left text-baby_powder-500">Icon</th>
                            <th class="p-4 text-left text-baby_powder-500">Name</th>
                            <th class="p-4 text-left text-baby_powder-500">Description</th>
                        </tr>
                        </thead>
                        <tbody>
                            @for (skill of skills; track skill.id) {
                                <tr class="border-t border-rich_black-500 hover:bg-forest_green-500/10 transition-colors">
                                    <td class="p-4">
                                        <img
                                                [src]="'assets/images/skills/' + skill.iconUrl"
                                                [alt]="skill.id"
                                                class="w-12 h-12 object-contain"
                                        />
                                    </td>
                                    <td class="p-4 text-baby_powder-500">{{ skill.name }}</td>
                                    <td class="p-4 text-gunmetal-200">{{ skill.description }}</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
  styles: [`
        :host {
            display: block;
            width: 100%;
        }
    `]
})
export class SkillDetailComponent {
    @Input({ required: true }) skills!: Skill[];
    @Input({ required: true }) skillType!: SkillType;

    formatSkillType(type: string): string {
      return type.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' ');
    }
}
