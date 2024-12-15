import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CharacterID, ClassID, EmblemID, SkillID, WeaponID } from '@/app/brands/ResourceID.brand';
import { SelectComponent } from '@/app/components/select/select.component';
import { SelectItemOption } from '@/app/components/select/selectItem.component';
import { SelectItemIconOption } from '@/app/components/select/selectItemWithIcon.component';
import { Character } from '@/app/models/Character.model';
import { Class } from '@/app/models/Class.model';
import { ClassType } from '@/app/models/ClassType.enum';
import { Country } from '@/app/models/Country.enum';
import { ImageSize } from '@/app/models/ImageSize.enum';
import { ResourceID } from '@/app/models/Resource.model';
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
  imports: [CommonModule, FormsModule, SelectComponent],
  standalone: true,
  template: `
        <div class="relative bg-gradient-to-br from-gunmetal-400/50 to-gunmetal-600/50 rounded-lg p-2 border border-rich_black-500 m-4">
            <!-- Member Number Badge -->
            <div class="absolute -top-3 -left-3 w-8 h-8 bg-rich_black-800 rounded-full flex items-center justify-center border-2 border-rich_black-500">
                <span class="text-baby_powder-500 font-bold">{{ member.id }}</span>
            </div>

            <div class="flex flex-col space-y-4">
                <div class="flex justify-around space-x-4">
                    <!-- Character Selection -->
                    <app-select [selectOptions]="characterOptions()" label="Character"
                                (selectedItemModelChange)="onCharacterSelect($event)"/>

                    <!-- Class Selection -->
                    <app-select [selectOptions]="classOptions()" [withIcon]="false" label="Class"
                                (selectedItemModelChange)="onClassSelect($event)"/>

                    <!-- Emblem Selection -->
                    <app-select [selectOptions]="emblemOptions()" label="Emblem"
                                (selectedItemModelChange)="onEmblemSelect($event)"/>


                    <!-- Weapons Selection -->
                    @for (weapon of weaponsOptions; track $index) {
                        <app-select [selectOptions]="weapon()" label="Weapon #{{$index + 1}}"
                                    (selectedItemModelChange)="onWeaponSelect($event, $index) "/>
                    }

                    <!-- Inheritable Skills Selection -->

                    @for (skill of skillOptions; track $index) {
                        <app-select [selectOptions]="skill()" label="Skill #{{$index + 1}}"
                                    (selectedItemModelChange)="onSkillSelect($event, $index)"/>
                    }
                </div>
            </div>
        </div>
    `
})
export class TeamMemberCardComponent {
    @Input() member!: TeamMember;
    characterOptions!: Signal<SelectItemIconOption<CharacterID>[]>;
    classOptions!: Signal<SelectItemOption<ClassID>[]>;
    emblemOptions!: Signal<SelectItemIconOption<EmblemID>[]>;
    weaponsOptions!: Signal<SelectItemIconOption<WeaponID>[]>[];
    skillOptions!: Signal<SelectItemIconOption<SkillID>[]>[];
    private readonly colorService: ColorService = inject(ColorService);
    private readonly teamService: TeamService = inject(TeamService);
    private readonly assetsService: AssetsService = inject(AssetsService);
    private readonly viewStateService: ViewStateService = inject(ViewStateService);

    ngOnInit() {
      this.characterOptions = computed(() => this.getCharacterOptions());
      this.classOptions = computed(() => this.getClassOptions());
      this.emblemOptions = computed(() => this.getEmblemOptions());
      this.weaponsOptions = Array(this.member.weapons.length)
        .fill(0).map((_: 0, index: number) => computed(() => this.getWeaponOptions(index)));
      this.skillOptions = Array(this.member.inheritableSkills.length)
        .fill(0).map((_: 0, index: number) => computed(() => this.getInheritableSkillOptions(index)));
    }

    //Options providers
    public getCharacterOptions(): SelectItemIconOption<CharacterID>[] {
      return this.getResourceSelectItemIconOptions(this.teamService.getAvailableCharacters(this.member.id)(),
        (identifier: string) => this.assetsService.getCharacterImage(identifier),
        (a, b) => getOrdinal(Country, a.country) - getOrdinal(Country, b.country),
        (character) => this.colorService.getColorForCharacter(character));
    }

    public getClassOptions(): SelectItemOption<ClassID>[] {
      return this.getResourceSelectItemOptions(this.teamService.getAvailableClasses(this.member.id)(),
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

    public getEmblemOptions(): SelectItemIconOption<EmblemID>[] {
      return this.getResourceSelectItemIconOptions(this.teamService.getAvailableEmblems(this.member.id)(), this.assetsService.getEmblemImage,
        (a, b) => a.id - b.id);
    }

    public getWeaponOptions(weaponSlotIndex: number): SelectItemIconOption<WeaponID>[] {
      return this.getResourceSelectItemIconOptions(this.teamService.getAvailableWeapons(this.member.id, weaponSlotIndex)(), this.assetsService.getWeaponImage,
        (a, b) => getOrdinal(WeaponType, a.weaponType) - getOrdinal(WeaponType, b.weaponType),
        (weapon: Weapon) => this.colorService.getColorForWeapon(weapon));
    }

    public getInheritableSkillOptions(skillSlotIndex: number): SelectItemIconOption<SkillID>[] {
      return this.getResourceSelectItemIconOptions(this.teamService.getAvailableInheritableSkills(this.member.id, skillSlotIndex)(), this.assetsService.getSkillImage,
        (a, b) => a.name.localeCompare(b.name));
    }

    public onCharacterSelect(option: SelectItemIconOption<CharacterID> | null): void {
      console.log('onCharacterSelect', option);
      this.teamService.updateMemberCharacter(this.member.id, option?.id ?? null);
    }

    public onEmblemSelect(option: SelectItemIconOption<EmblemID> | null): void {
      this.teamService.updateMemberEmblem(this.member.id, option?.id ?? null);
    }

    public onClassSelect(option: SelectItemOption<ClassID> | null): void {
      this.teamService.updateMemberClass(this.member.id, option?.id ?? null);
    }

    public onWeaponSelect(option: SelectItemIconOption<WeaponID> | null, weaponIndex: number): void {
      if (weaponIndex < 0 || weaponIndex >= this.member.weapons.length) {
        console.error(`Invalid weapon index: ${weaponIndex}`);
        return;
      }
      this.teamService.updateMemberWeapon(this.member.id, weaponIndex, option?.id ?? null);
    }

    public onSkillSelect(option: SelectItemIconOption<SkillID> | null, skillIndex: number): void {
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

    public getResourceSelectItemIconOptions<T extends {
        id: U;
        name: string;
        identifier: string
    }, U extends ResourceID>(
      resources: T[],
      getImageUrl: (identifier: string, size?: ImageSize) => string,
      sortComparator: (a: T, b: T) => number,
      getBorderColor?: (resource: T) => string
    ): SelectItemIconOption<U>[] {
      return resources.sort(sortComparator).map((resource: T) => ({
        id: resource.id,
        name: resource.name,
        iconUrl: getImageUrl(resource.identifier),
        borderColor: getBorderColor ? getBorderColor(resource) : '#808080'
      }));
    }

    public getResourceSelectItemOptions<T extends { id: U; name: string; identifier: string }, U extends ResourceID>(
      resources: T[],
      sortComparator: (a: T, b: T) => number,
      getBorderColor?: (resource: T) => string
    ): SelectItemOption<U>[] {
      return resources.sort(sortComparator).map((resource: T) => ({
        id: resource.id,
        name: resource.name,
        borderColor: getBorderColor ? getBorderColor(resource) : '#808080'
      }));
    }
}
