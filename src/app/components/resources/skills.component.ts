import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, Signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';

import { SkillDetailComponent } from '@/app/components/resources/details/skill-detail.component';
import { ImageType } from '@/app/models/ImageSize.enum';
import { Skill } from '@/app/models/Skill.model';
import { SkillType } from '@/app/models/SkillType.enum';
import { AssetsService } from '@/app/services/assets.service';
import { SkillService } from '@/app/services/resources.service';
import { ViewStateService } from '@/app/services/view-state.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    SelectButtonModule,
    SkillDetailComponent
  ],
  template: `
        <div class="w-full h-full flex flex-col p-6 bg-gradient-to-br from-prussian_blue-400 to-rich_black-600">
            <!-- Search and Filter Section -->
            <div class="flex flex-col gap-4 mb-6">
                <!-- Search Bar -->
                <div class="flex-1">
          <span class="p-input-icon-left w-full">
            <input
                    type="text"
                    pInputText
                    [(ngModel)]="searchQuery"
                    placeholder="Search skills..."
                    class="w-full bg-rich_black-500/50 border-rich_black-400"
            />
          </span>
                </div>

                <!-- Skill Type Filter -->
                <p-selectButton
                        [options]="skillTypeOptions"
                        [(ngModel)]="selectedSkillType"
                        [multiple]="false"
                        [allowEmpty]="false"
                        optionLabel="label"
                        optionValue="value"
                ></p-selectButton>
            </div>

            <!-- Skills List and Detail Split View -->
            <div class="flex gap-6 h-[calc(100%-8rem)] overflow-hidden">
                <!-- Skills List -->
                <div class="w-1/3 overflow-y-auto pr-4 custom-scrollbar">
                    <div class="space-y-2">
                        @for (skill of filteredSkills(); track skill.id) {
                            <div
                                    class="flex items-center gap-3 p-3 bg-rich_black-500/50 rounded-lg cursor-pointer transition-all duration-200 hover:bg-rich_black-400/50"
                                    (click)="selectSkill(skill)"
                            >
                                <img
                                        [src]="getSkillImage(skill.identifier)"
                                        [alt]="skill.name"
                                        class="w-12 h-12 rounded-lg"
                                />
                                <div>
                                    <h3 class="text-baby_powder-500 font-medium">{{ skill.name }}</h3>
                                    <span class="text-sm text-paynes_gray-800">{{ getSkillTypeLabel(skill.skillType) }}</span>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <!-- Skill Detail -->
                @if (selectedSkill(); as skill) {
                    <skill-detail class="flex-1" [skill]="skill"/>
                }
            </div>
        </div>
    `,
  styles: [`
        .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(122, 147, 172, 0.5) transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(122, 147, 172, 0.5);
            border-radius: 3px;
        }
    `]
})
export class SkillsComponent {
  protected searchQuery: WritableSignal<string> = signal('');
  protected selectedSkillType: WritableSignal<SkillType> = signal<SkillType>(SkillType.PERSONAL);
  protected selectedSkill: WritableSignal<Skill | null> = signal(null);

  protected readonly skillTypeOptions = [
    { label: 'Personal', value: SkillType.PERSONAL },
    { label: 'Class', value: SkillType.CLASS },
    { label: 'Inheritable', value: SkillType.EMBLEM_INHERITABLE },
    { label: 'Sync', value: SkillType.EMBLEM_SYNC },
    { label: 'Engage', value: SkillType.EMBLEM_ENGAGE }
  ];

  private readonly assetsService: AssetsService = inject(AssetsService);
  private readonly skillService: SkillService = inject(SkillService);
  protected readonly filteredSkills: Signal<Skill[]> = computed((): Skill[] => {
    const query: string = this.searchQuery().toLowerCase();
    const type: SkillType = this.selectedSkillType();

    return this.skillService.resources()
      .filter((skill: Skill) => skill.skillType === type)
      .filter((skill: Skill) =>
        skill.name.toLowerCase().includes(query) ||
                skill.description.toLowerCase().includes(query)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  });
  private readonly viewStateService: ViewStateService = inject(ViewStateService);

  constructor() {
    effect(() => {
      const selectedId: number | null = this.viewStateService.getSelectedSkillId()();
      if (selectedId !== null) {
        const skill: Skill | undefined = this.skillService.resources()
          .find((skill: Skill) => skill.id === selectedId);
        if (skill) {
          this.selectedSkill.set(skill);
          this.selectedSkillType.set(skill.skillType);
        }
        this.viewStateService.setSelectedSkillId(null);
      }
    });
  }

  protected getSkillImage(identifier: string): string {
    return this.assetsService.getSkillImage(identifier, ImageType.BODY);
  }

  protected getSkillTypeLabel(type: SkillType): string {
    return this.skillTypeOptions.find(option => option.value === type)?.label || type;
  }

  protected selectSkill(skill: Skill): void {
    this.selectedSkill.set(skill);
  }
}
