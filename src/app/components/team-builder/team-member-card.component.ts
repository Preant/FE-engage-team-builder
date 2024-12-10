import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input } from '@angular/core';

import { CharacterID, EmblemID, SkillID, TeamMemberID, WeaponID } from '@/app/brands/ResourceID.brand';
import { CustomSelectComponent, SelectOption } from '@/app/components/customSelect.component';
import { ImageSize } from '@/app/models/ImageSize.enum';
import { ViewType } from '@/app/models/ViewType.enum';
import { AssetsService } from '@/app/services/assets.service';
import { CharacterService, EmblemService } from '@/app/services/resources.service';
import { TeamService } from '@/app/services/team.service';
import { ViewStateService } from '@/app/services/view-state.service';


@Component({
    selector: 'app-team-member-card',
    imports: [CommonModule, CustomSelectComponent],
    template: `
        <div class="bg-gradient-to-br from-gunmetal-400/50 to-gunmetal-600/50 rounded-lg p-4 backdrop-blur-sm border border-rich_black-500">
            <div class="flex flex-col space-y-4">
                <div class="flex items-start space-x-4">
                    <!-- Character Selection -->
                    <div class="relative flex-shrink-0" style="width: 160px">
                        <h3 class="text-baby_powder-500 text-sm mb-2 font-semibold">Character</h3>
                        <div class="relative">
                            @if (selectedCharacter(); as char) {
                                <button
                                        (click)="viewCharacterDetails($event)"
                                        class="absolute top-2 right-2 w-6 h-6 bg-forest_green-500 text-baby_powder-500 rounded-full flex items-center justify-center hover:bg-forest_green-600 transition-colors duration-300 z-10"
                                        title="View character details"
                                >
                                    <span class="text-lg leading-none">+</span>
                                </button>
                            }
                            <app-custom-select
                                    [options]="characterOptions()"
                                    [selectedId]="member().characterId ?? null"
                                    [selectedOption]="selectedCharacterOption()"
                                    (selectionChange)="onCharacterSelected($event)"
                                    placeholder="None"
                            />
                        </div>
                    </div>

                    <!-- Emblem Selection -->
                    <div class="relative flex-shrink-0" style="width: 100px">
                        <h3 class="text-baby_powder-500 text-sm mb-2 font-semibold">Emblem</h3>
                        <app-custom-select
                                [options]="emblemOptions()"
                                [selectedId]="member().emblemId ?? null"
                                [selectedOption]="selectedEmblemOption()"
                                (selectionChange)="onEmblemSelected($event)"
                                placeholder="None"
                        />
                    </div>

                    <!-- Weapons Selection -->
                    <div class="flex-grow">
                        <h3 class="text-baby_powder-500 text-sm mb-2 font-semibold">Weapons</h3>
                        <div class="flex space-x-2">
                            @for (weaponId of member().weaponIds; track $index) {
                                <app-custom-select
                                        [options]="getWeaponOptionsForSlot($index)()"
                                        [selectedId]="weaponId"
                                        [selectedOption]="getSelectedWeaponOption($index)()"
                                        (selectionChange)="onWeaponSelect($event, $index)"
                                        placeholder="None"
                                />
                            }
                        </div>
                    </div>

                    <!-- Inheritable Skills Selection -->
                    <div class="flex-grow">
                        <h3 class="text-baby_powder-500 text-sm mb-2 font-semibold">Inheritable Skills</h3>
                        <div class="flex space-x-2">
                            <app-custom-select
                                    [options]="firstSkillOptions()"
                                    [selectedId]="member().inheritableSkillIds[0]"
                                    [selectedOption]="firstSkillOption()"
                                    (selectionChange)="onFirstSkillSelect($event)"
                                    placeholder="First Skill"
                            />
                            <app-custom-select
                                    [options]="secondSkillOptions()"
                                    [selectedId]="member().inheritableSkillIds[1]"
                                    [selectedOption]="secondSkillOption()"
                                    (selectionChange)="onSecondSkillSelect($event)"
                                    placeholder="Second Skill"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class TeamMemberCardComponent {
    @Input({ required: true }) memberId!: TeamMemberID;

    private readonly teamService = inject(TeamService);
    member = computed(() => this.teamService.getMemberById(this.memberId)());
    private readonly assetsService = inject(AssetsService);

    characterOptions = computed(() =>
      this.getResourceSelectOptions(
        this.teamService.getAvailableCharacters(this.memberId)(),
        (id) => this.assetsService.getCharacterImage(id, ImageSize.SMALL)
      ));
    emblemOptions = computed(() => this.getResourceSelectOptions(
      this.teamService.getAvailableEmblems(this.memberId)(),
      (id, secondaryId) => this.assetsService.getEmblemImage(id, secondaryId, ImageSize.SMALL)
    ));
    firstSkillOptions = computed(() =>
      this.getResourceSelectOptions(
        this.teamService.getAvailableInheritableSkills(this.memberId, 0)(),
        (id) => this.assetsService.getSkillImage(id, ImageSize.SMALL)
      )
    );
    secondSkillOptions = computed(() =>
      this.getResourceSelectOptions(
        this.teamService.getAvailableInheritableSkills(this.memberId, 1)(),
        (id) => this.assetsService.getSkillImage(id, ImageSize.SMALL)
      )
    );
    firstSkillOption = computed(() => {
      const skills = this.teamService.getMemberSkills(this.memberId)();
      const skill = skills[0];
      if (!skill) {
        return null;
      }

      return {
        id: skill.id,
        name: skill.name,
        iconUrl: this.assetsService.getSkillImage(skill.identifier, ImageSize.SMALL)
      };
    });
    secondSkillOption = computed(() => {
      const skills = this.teamService.getMemberSkills(this.memberId)();
      const skill = skills[1];
      if (!skill) {
        return null;
      }

      return {
        id: skill.id,
        name: skill.name,
        iconUrl: this.assetsService.getSkillImage(skill.identifier, ImageSize.SMALL)
      };
    });
    private readonly viewStateService = inject(ViewStateService);
    private readonly characterService = inject(CharacterService);
    selectedCharacter = computed(() => {
      const characterId = this.member()?.characterId;
      return characterId ? this.characterService.getResourceById(characterId) : null;
    });
    selectedCharacterOption = computed(() => {
      const character = this.selectedCharacter();
      if (!character) {
        return null;
      }
      return {
        id: character.id,
        name: character.name,
        iconUrl: this.assetsService.getCharacterImage(character.identifier, ImageSize.SMALL)
      };
    });
    private readonly emblemService = inject(EmblemService);
    selectedEmblem = computed(() => {
      const emblemId = this.member()?.emblemId;
      return emblemId ? this.emblemService.getResourceById(emblemId) : null;
    });
    selectedEmblemOption = computed(() => {
      const emblem = this.selectedEmblem();
      if (!emblem) {
        return null;
      }
      return {
        id: emblem.id,
        name: emblem.name,
        iconUrl: this.assetsService.getEmblemImage(
          emblem.identifier,
          emblem.secondaryIdentifier,
          ImageSize.SMALL
        )
      };
    });

    getWeaponOptionsForSlot(slotIndex: number) {
      return computed(() => {
        const availableWeapons = this.teamService.getAvailableWeapons(this.memberId, slotIndex)();
        return this.getResourceSelectOptions(
          availableWeapons,
          (id) => this.assetsService.getWeaponImage(id, ImageSize.SMALL)
        );
      });
    }

    getSelectedWeaponOption(slotIndex: number) {
      return computed(() => {
        const weapons = this.teamService.getMemberWeapons(this.memberId)();
        const weapon = weapons[slotIndex];
        if (!weapon) {
          return null;
        }

        return {
          id: weapon.id,
          name: weapon.name,
          iconUrl: this.assetsService.getWeaponImage(weapon.identifier, ImageSize.SMALL)
        };
      });
    }

    // Event handlers
    onFirstSkillSelect(option: SelectOption<SkillID>): void {
      this.teamService.updateMemberSkill(this.memberId, 0, option.id);
    }

    onSecondSkillSelect(option: SelectOption<SkillID>): void {
      this.teamService.updateMemberSkill(this.memberId, 1, option.id);
    }

    onCharacterSelected(option: SelectOption<CharacterID>): void {
      this.teamService.updateMemberCharacter(this.memberId, option.id);
    }

    onEmblemSelected(option: SelectOption<EmblemID>): void {
      this.teamService.updateMemberEmblem(this.memberId, option.id);
    }

    onWeaponSelect(option: SelectOption<WeaponID>, weaponIndex: number): void {
      this.teamService.updateMemberWeapon(this.memberId, weaponIndex, option.id);
    }

    viewCharacterDetails(event: Event): void {
      event.stopPropagation();
      const character = this.selectedCharacter();
      if (character) {
        this.viewStateService.setSelectedCharacterId(character.id);
        this.viewStateService.setView(ViewType.CHARACTERS);
      }
    }

    private getResourceSelectOptions<T>(
      resources: Array<{ id: T; name: string; identifier: string; secondaryIdentifier?: string }>,
      getImageUrl: (identifier: string, secondaryId?: string) => string
    ): SelectOption<T>[] {
      return resources.map(resource => ({
        id: resource.id,
        name: resource.name,
        iconUrl: getImageUrl(resource.identifier, resource.secondaryIdentifier)
      }));
    }
}
