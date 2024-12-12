import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';

import { CarouselComponent, CarouselItem } from '@/app/components/carousel.component';
import { SkillDetailComponent } from '@/app/components/skill-detail.component';
import { Skill } from '@/app/models/Skill.model';
import { SkillType } from '@/app/models/SkillType.enum';
import { AssetsService } from '@/app/services/assets.service';
import { SkillService } from '@/app/services/resources.service';

@Component({
  selector: 'app-skills',
  imports: [
    CommonModule,
    CarouselComponent,
    SkillDetailComponent
  ],
  template: `
        <div class="min-h-screen p-6 bg-gradient-to-br from-prussian_blue-400 to-rich_black-600">
            <div class="space-y-6">
                <app-carousel
                        [items]="carouselItems()"
                        (itemSelected)="handleSkillTypeSelected($event)"/>

                @if (selectedSkillType(); as skillType) {
                    <div class="mt-8 fade-in">
                        <skill-detail
                                [skills]="getSkillsByType(skillType)"
                                [skillType]="skillType"/>
                    </div>
                }
            </div>
        </div>
    `,
  standalone: true,
  styles: [`
        :host {
            display: block;
            min-height: 100vh;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .fade-in {
            animation: fadeIn 0.5s ease-out;
        }
    `]
})
export class SkillsComponent {
  selectedSkillType: WritableSignal<SkillType | null> = signal(null);
  private skillService: SkillService = inject(SkillService);
  private assetsService: AssetsService = inject(AssetsService);
  public carouselItems: Signal<CarouselItem[]> = computed(() => {
    return Object.values(SkillType).map((type: SkillType, index: number) => {
      const skills: Skill[] = this.skillService.getSkillsByType(type);
      return {
        id: index,
        label: this.formatSkillType(type),
        imageUrl: this.assetsService.getSkillImage(skills[Math.floor(Math.random() * skills.length)].identifier)
      };
    });
  });
  private skills: SkillType[] = [
    SkillType.PERSONAL,
    SkillType.CLASS,
    SkillType.EMBLEM_INHERITABLE,
    SkillType.EMBLEM_SYNC,
    SkillType.EMBLEM_ENGAGE
  ];

  handleSkillTypeSelected(id: number): void {
    this.selectedSkillType.set(this.skills[id]);
  }

  getSkillsByType(type: SkillType): Skill[] {
    return this.skillService.getSkillsByType(type);
  }

  private formatSkillType(type: SkillType): string {
    return type.split('_').map((word: string): string =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  }
}
