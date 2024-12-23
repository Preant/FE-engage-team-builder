import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, signal, Signal, WritableSignal } from '@angular/core';

import { ImageType } from '@/app/models/ImageSize.enum';
import { Skill } from '@/app/models/Skill.model';
import { AssetsService } from '@/app/services/assets.service';
import { SkillService } from '@/app/services/resources.service';

@Component({
  selector: 'skill-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div class="w-full h-full relative rounded-lg bg-gradient-to-br from-rich_black-400/95 to-rich_black-600/95 p-6">
            <!-- Content Container -->
            <div class="relative z-10 flex flex-col h-full">
                <!-- Header Section -->
                <div class="flex items-start gap-6 mb-8">
                    <img
                            [src]="getSkillImage(skill.identifier)"
                            [alt]="skill.name"
                            class="w-24 h-24 rounded-lg border-2 border-air_superiority_blue-500"
                    />
                    <div>
                        <h2 class="text-3xl font-bold text-baby_powder-500 mb-2">{{ skill.name }}</h2>
                        <span class="px-3 py-1 rounded-full bg-prussian_blue-500/50 text-air_superiority_blue-700">
              {{ skill.skillType }}
            </span>
                    </div>
                </div>

                <!-- Description Section -->
                <div class="bg-rich_black-500/30 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold text-mauve-400 mb-4">Description</h3>
                    <p class="text-paynes_gray-800 leading-relaxed">{{ skill.description }}</p>
                </div>

                <!-- Evolution Chain Section -->
                @if (evolutionChain().length > 1) {
                    <div class="mt-6 bg-rich_black-500/30 p-6 rounded-lg">
                        <h3 class="text-xl font-semibold text-mauve-400 mb-4">Evolution Chain</h3>
                        <div class="flex items-center gap-4">
                            @for (evolvedSkill of evolutionChain(); track evolvedSkill.id) {
                                <div class="flex flex-col items-center">
                                    <img
                                            [src]="getSkillImage(evolvedSkill.identifier)"
                                            [alt]="evolvedSkill.name"
                                            class="w-16 h-16 rounded-lg"
                                            [class.border-2]="evolvedSkill.id === skill.id"
                                            [class.border-air_superiority_blue-500]="evolvedSkill.id === skill.id"
                                    />
                                    <span class="text-sm text-paynes_gray-800 mt-2">{{ evolvedSkill.name }}</span>
                                </div>
                                @if (!$last) {
                                    <i class="pi pi-arrow-right text-paynes_gray-500"></i>
                                }
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    `
})
export class SkillDetailComponent {
  private readonly _skill: WritableSignal<Skill | null> = signal<Skill | null>(null);
  private readonly assetsService: AssetsService = inject(AssetsService);
  private readonly skillService: SkillService = inject(SkillService);
  protected readonly evolutionChain: Signal<Skill[]> = computed((): Skill[] => {
    const skill: Skill | null = this._skill();
    if (!skill) {
      return [];
    }
    return this.skillService.getSkillEvolveChainBySkillId(skill.id);
  });

  get skill(): Skill {
    return this._skill()!;
  }

    @Input({ required: true })
  set skill(value: Skill) {
    this._skill.set(value);
  }

    protected getSkillImage(identifier: string): string {
      return this.assetsService.getSkillImage(identifier, ImageType.BODY);
    }
}
