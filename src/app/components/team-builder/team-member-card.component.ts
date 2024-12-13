import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, Signal } from '@angular/core';

import { CharacterID, ClassID, EmblemID, SkillID, WeaponID } from '@/app/brands/ResourceID.brand';
import { CustomSelectComponent, SelectOption } from '@/app/components/customSelect.component';
import { Character } from '@/app/models/Character.model';
import { Class } from '@/app/models/Class.model';
import { ClassType } from '@/app/models/ClassType.enum';
import { Country } from '@/app/models/Country.enum';
import { Emblem } from '@/app/models/Emblem.model';
import { ImageSize } from '@/app/models/ImageSize.enum';
import { ResourceID } from '@/app/models/Resource.model';
import { Skill } from '@/app/models/Skill.model';
import { TeamMember } from '@/app/models/Team.model';
import { ViewType } from '@/app/models/ViewType.enum';
import { Weapon } from '@/app/models/Weapon.model';
import { WeaponType } from '@/app/models/WeaponType.enum';
import { AssetsService } from '@/app/services/assets.service';
import { ColorService } from '@/app/services/Color.service';
import { TeamService } from '@/app/services/team.service';
import { ViewStateService } from '@/app/services/view-state.service';
import { getOrdinal } from '@/app/utils/getOrdinal';


@Component({
  selector: 'app-team-member-card',
  imports: [CommonModule, CustomSelectComponent],
  standalone: true,
  template: `
        <div class="relative bg-gradient-to-br from-gunmetal-400/50 to-gunmetal-600/50 rounded-lg p-2 border border-rich_black-500 m-4">
            <!-- Member Number Badge -->
            <div class="absolute -top-3 -left-3 w-8 h-8 bg-rich_black-800 rounded-full flex items-center justify-center border-2 border-rich_black-500">
                <span class="text-baby_powder-500 font-bold">{{ member.id }}</span>
            </div>

            <div class="flex flex-col space-y-4">
                <div class="flex justify-around space-x-4 overflow-y-visible overflow-x-clip">
                    <!-- Character Selection -->
                    <div>
                        <h3 class=" text-baby_powder-500 text-sm mb-2 font-semibold
                                        ">Character</h3>
                        <div class="w-fit relative">
                            @if (member.character; as char) {
                                <button
                                        (click)="viewCharacterDetails($event)"
                                        class="absolute z-10 left-10 w-6 h-6 bg-forest_green-500 text-baby_powder-500 rounded-full flex items-center justify-center hover:bg-forest_green-600 transition-colors duration-300"
                                        title="View character details"
                                >
                                    <span class="text-lg leading-none z-10">+</span>
                                </button>
                            }
                            <app-custom-select
                                    [optionsProvider]="getCharacterOptions.bind(this)"
                                    (selectionChange)="onCharacterSelected($event)"
                            />
                        </div>
                    </div>

                    <!-- Class Selection -->
                    <div class="w-fit">
                        <h3 class="text-baby_powder-500 text-sm mb-2 font-semibold">Class</h3>
                        <app-custom-select
                                [optionsProvider]="getClassOptions.bind(this)"
                                (selectionChange)="onClassSelected($event)"
                        />
                    </div>

                    <!-- Emblem Selection -->
                    <div class="w-fit">
                        <h3 class="text-baby_powder-500 text-sm mb-2 font-semibold">Emblem</h3>
                        <app-custom-select
                                [optionsProvider]="getEmblemOptions.bind(this)"
                                (selectionChange)="onEmblemSelected($event)"
                        />
                    </div>

                    <!-- Weapons Selection -->
                    <div class="w-fit">
                        <h3 class="text-baby_powder-500 text-sm mb-2 font-semibold">Weapons</h3>
                        <div class="flex space-x-2">
                            @for (weapon of member.weapons; track $index) {
                                <app-custom-select
                                        [optionsProvider]="getWeaponOptions.bind(this, $index)"
                                        (selectionChange)="onWeaponSelect($event, $index)"
                                />
                            }
                        </div>
                    </div>

                    <!-- Inheritable Skills Selection -->
                    <div class="w-fit">
                        <h3 class="text-baby_powder-500 text-sm mb-2 font-semibold whitespace-nowrap">Inheritable
                            Skills</h3>
                        <div class="flex space-x-2">
                            @for (skill of member.inheritableSkills; track $index) {
                                <app-custom-select
                                        [optionsProvider]="getInheritableSkillOptions.bind(this, $index)"
                                        (selectionChange)="onSkillSelect($event, $index)"
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class TeamMemberCardComponent {
    @Input() member!: TeamMember;
    weaponSignals!: Signal<Signal<Weapon[]>>[];
    skillSignals!: Signal<Signal<Skill[]>>[];
    characterSignal!: Signal<Character[]>;
    classSignal!: Signal<Class[]>;
    private readonly colorService: ColorService = inject(ColorService);
    private readonly teamService: TeamService = inject(TeamService);
    //à garder pour démo à Yoann
    readonly emblemSignal: Signal<Emblem[]> = computed(() =>
      this.teamService.getAvailableEmblems(this.member.id)()
    );
    private readonly assetsService: AssetsService = inject(AssetsService);
    private readonly viewStateService: ViewStateService = inject(ViewStateService);

    ngOnInit(): void {
      this.characterSignal = this.teamService.getAvailableCharacters(this.member.id);
      this.classSignal = this.teamService.getAvailableClasses(this.member.id);
      this.weaponSignals = Array(this.member.weapons.length)
        .fill(0).map((_: 0, index: number) => computed(() => this.teamService.getAvailableWeapons(this.member.id, index)));
      this.skillSignals = Array(this.member.inheritableSkills.length)
        .fill(0).map((_: 0, index: number) => computed(() => this.teamService.getAvailableInheritableSkills(this.member.id, index)));
    }

    //Options providers
    public getCharacterOptions(): SelectOption<CharacterID>[] {
      return this.getResourceSelectOptions(this.characterSignal(),
        (identifier: string) => this.assetsService.getCharacterImage(identifier),
        (a, b) => getOrdinal(Country, a.country) - getOrdinal(Country, b.country),
        (character) => this.colorService.getColorForCharacter(character));
    }

    public getClassOptions(): SelectOption<ClassID>[] {
      return this.getResourceSelectOptions(this.classSignal(),
        (_identifier: string) => '',
        (a, b) => {
          if (a.signatureCharacter && !b.signatureCharacter) {
            return -1;
          } else if (!a.signatureCharacter && b.signatureCharacter) {
            return 1;
          }
          return getOrdinal(ClassType, a.type) - getOrdinal(ClassType, b.type);
        },
        (combatClass: Class) => this.colorService.getColorForClassType(combatClass));
    }

    public getEmblemOptions(): SelectOption<EmblemID>[] {
      return this.getResourceSelectOptions(this.emblemSignal(), this.assetsService.getEmblemImage,
        (a, b) => a.id - b.id);
    }

    public getWeaponOptions(weaponSlotIndex: number): SelectOption<WeaponID>[] {
      return this.getResourceSelectOptions(this.weaponSignals[weaponSlotIndex]()(), this.assetsService.getWeaponImage,
        (a, b) => getOrdinal(WeaponType, a.weaponType) - getOrdinal(WeaponType, b.weaponType),
        (weapon: Weapon) => this.colorService.getColorForWeapon(weapon));
    }

    public getInheritableSkillOptions(skillSlotIndex: number): SelectOption<SkillID>[] {
      return this.getResourceSelectOptions(this.skillSignals[skillSlotIndex]()(), this.assetsService.getSkillImage,
        (a, b) => a.name.localeCompare(b.name));
    }

    // Event handlers
    public onCharacterSelected(option: SelectOption<CharacterID> | null): void {
      this.teamService.updateMemberCharacter(this.member.id, option?.id ?? null);
    }

    public onClassSelected(option: SelectOption<ClassID> | null): void {
      this.teamService.updateMemberClass(this.member.id, option?.id ?? null);
    }

    public onEmblemSelected(option: SelectOption<EmblemID> | null): void {
      this.teamService.updateMemberEmblem(this.member.id, option?.id ?? null);
    }

    public onWeaponSelect(option: SelectOption<WeaponID> | null, weaponIndex: number): void {
      if (weaponIndex < 0 || weaponIndex >= this.member.weapons.length) {
        console.error(`Invalid weapon index: ${weaponIndex}`);
        return;
      }
      this.teamService.updateMemberWeapon(this.member.id, weaponIndex, option?.id ?? null);
    }

    public onSkillSelect(option: SelectOption<SkillID> | null, skillIndex: number): void {
      if (skillIndex < 0 || skillIndex >= this.member.inheritableSkills.length) {
        console.error(`Invalid skill index: ${skillIndex}`);
        return;
      }
      this.teamService.updateMemberInheritableSkill(this.member.id, skillIndex, option?.id ?? null);
    }

    viewCharacterDetails(event: Event): void {
      event.stopPropagation();
      const character: Character | null = this.member.character;
      if (character) {
        this.viewStateService.setSelectedCharacterId(character.id);
        this.viewStateService.setView(ViewType.CHARACTERS);
      }
    }

    public getResourceSelectOptions<T extends { id: U; name: string; identifier: string }, U extends ResourceID>(
      resources: T[],
      getImageUrl: (identifier: string, size?: ImageSize) => string,
      sortComparator: (a: T, b: T) => number,
      getBorderColor?: (resource: T) => string
    ): SelectOption<U>[] {
      return resources.sort(sortComparator).map((resource: T) => ({
        id: resource.id,
        name: resource.name,
        iconUrl: getImageUrl(resource.identifier),
        borderColor: getBorderColor ? getBorderColor(resource) : '#808080'
      }));
    }
}
