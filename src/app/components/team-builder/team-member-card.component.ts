import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

import { CharacterID, ClassID, EmblemID, SkillID, WeaponID } from '@/app/brands/ResourceID.brand';
import {
  SelectComponent,
  SelectOptionIcon,
  SelectOptionLabel,
  SelectType
} from '@/app/components/select/select.component';
import { Character } from '@/app/models/Character.model';
import { Class } from '@/app/models/Class.model';
import { ClassType } from '@/app/models/ClassType.enum';
import { Country } from '@/app/models/Country.enum';
import { Emblem } from '@/app/models/Emblem.model';
import { ImageType } from '@/app/models/ImageSize.enum';
import { ResourceID } from '@/app/models/Resource.model';
import { TeamMember } from '@/app/models/Team.model';
import { ViewType } from '@/app/models/ViewType.enum';
import { Weapon } from '@/app/models/Weapon.model';
import { WeaponType } from '@/app/models/WeaponType.enum';
import { AssetsService } from '@/app/services/assets.service';
import { ColorService } from '@/app/services/Color.service';
import { ClassService } from '@/app/services/resources.service';
import { TeamService } from '@/app/services/team.service';
import { ViewStateService } from '@/app/services/view-state.service';
import { getOrdinal } from '@/app/utils/getOrdinal';

@Component({
  selector: 'app-team-member-card',
  imports: [CommonModule, FormsModule, SelectComponent, Select],
  standalone: true,
  template: `
        <div class="relative bg-gradient-to-br from-gunmetal-400/50 to-gunmetal-600/50 rounded-lg p-2 border border-rich_black-500 m-4">
            <div class="absolute -top-3 -left-3 w-8 h-8 bg-rich_black-800 rounded-full flex items-center justify-center border-2 border-rich_black-500">
                <span class="text-baby_powder-500 font-bold">{{ member.id }}</span>
            </div>

            <div class="flex flex-col space-y-4">
                <div class="flex justify-around flex-wrap space-x-4">
                    <app-select
                            class="w-36 h-24"
                            [selectOptions]="characterOptions()"
                            label="Character"
                            showDetailsButton
                            (detailsButtonClicked)="viewCharacterDetails()"
                            [type]="SelectType.ICON"
                            [initialSelection]="member.character?.id"
                            (selectedItemModelChange)="onCharacterSelect($event?.id ?? null)"/>

                    <app-select
                            class="w-52 h-24"
                            [selectOptions]="classOptions()"
                            label="Class"
                            [type]="SelectType.LABEL"
                            [initialSelection]="member.class?.id"
                            (selectedItemModelChange)="onClassSelect($event?.id ?? null)"
                    />

                    <app-select
                            class="w-36 h-24"
                            [selectOptions]="emblemOptions()"
                            showDetailsButton
                            (detailsButtonClicked)="viewEmblemDetails()"
                            label="Emblem"
                            [type]="SelectType.ICON"
                            [initialSelection]="member.emblem?.id"
                            (selectedItemModelChange)="onEmblemSelect($event?.id ?? null)"/>


                    @for (skill of skillOptions; track $index) {
                        <app-select
                                class="w-36 h-24"
                                [selectOptions]="skill()"
                                label="Skill #{{$index + 1}}"
                                [type]="SelectType.ICON"
                                [initialSelection]="member.inheritableSkills[$index]?.id"
                                (selectedItemModelChange)="onSkillSelect($event?.id ?? null, $index)"/>
                    }
                    @for (weapon of weaponsOptions; track $index) {
                        <app-select
                                class="w-36 h-24"
                                [selectOptions]="weapon()"
                                showDetailsButton
                                (detailsButtonClicked)="viewWeaponDetails($index)"
                                label="Weapon #{{$index + 1}}"
                                [type]="SelectType.ICON"
                                [initialSelection]="member.weapons[$index]?.id"
                                (selectedItemModelChange)="onWeaponSelect($event?.id ?? null, $index)"/>
                    }
                </div>
            </div>
        </div>
    `
})
export class TeamMemberCardComponent {
    @Input() member!: TeamMember;
    characterOptions!: Signal<SelectOptionIcon<CharacterID>[]>;
    classOptions!: Signal<SelectOptionLabel<ClassID>[]>;
    emblemOptions!: Signal<SelectOptionIcon<EmblemID>[]>;
    weaponsOptions!: Signal<SelectOptionIcon<WeaponID>[]>[];
    skillOptions!: Signal<SelectOptionIcon<SkillID>[]>[];
    protected readonly SelectType: typeof SelectType = SelectType;
    private readonly colorService: ColorService = inject(ColorService);
    private readonly teamService: TeamService = inject(TeamService);
    private readonly classService: ClassService = inject(ClassService);
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
    public getCharacterOptions(): SelectOptionIcon<CharacterID>[] {
      return this.getResourceSelectItemIconOptions(this.teamService.getAvailableCharacters(this.member.id)(),
        (identifier: string) => this.assetsService.getCharacterImage(identifier, ImageType.BANNER_SMALL),
        (identifier: string) => this.assetsService.getCharacterImage(identifier, ImageType.BODY_SMALL),
        (a, b) => getOrdinal(Country, a.country) - getOrdinal(Country, b.country),
        (character: Character) => this.colorService.getColorForCharacter(character));
    }

    public getClassOptions(): SelectOptionLabel<ClassID>[] {
      return this.getResourceSelectItemOptions(this.teamService.getAvailableClasses(this.member.id)(),
        (a, b) => {
          if (a.signatureCharacter && !b.signatureCharacter) {
            return -1;
          } else if (!a.signatureCharacter && b.signatureCharacter) {
            return 1;
          }
          return getOrdinal(ClassType, a.type) - getOrdinal(ClassType, b.type);
        },
        (identifier: string): string[] => {
          const combatClass: Class = this.classService.getResourceByIdentifier(identifier);
          return combatClass.weapons.map((weapon) => this.assetsService.getWeaponTypeImage(weapon[0]));
        },
        (combatClass: Class) => this.colorService.getColorForClassType(combatClass));
    }

    public getEmblemOptions(): SelectOptionIcon<EmblemID>[] {
      return this.getResourceSelectItemIconOptions(this.teamService.getAvailableEmblems(this.member.id)(),
        (identifier: string) => this.assetsService.getEmblemImage(identifier, ImageType.BODY),
        (identifier: string) => this.assetsService.getEmblemImage(identifier, ImageType.BODY),
        (a, b) => a.id - b.id);
    }

    public getWeaponOptions(weaponSlotIndex: number): SelectOptionIcon<WeaponID>[] {
      return this.getResourceSelectItemIconOptions(this.teamService.getAvailableWeapons(this.member.id, weaponSlotIndex)(),
        (identifier: string) => this.assetsService.getWeaponImage(identifier, ImageType.BODY),
        (identifier: string) => this.assetsService.getWeaponImage(identifier, ImageType.BODY),
        (a, b) => getOrdinal(WeaponType, a.weaponType) - getOrdinal(WeaponType, b.weaponType),
        (weapon: Weapon) => this.colorService.getColorForWeapon(weapon));
    }

    public getInheritableSkillOptions(skillSlotIndex: number): SelectOptionIcon<SkillID>[] {
      return this.getResourceSelectItemIconOptions(this.teamService.getAvailableInheritableSkills(this.member.id, skillSlotIndex)(),
        (identifier: string) => this.assetsService.getSkillImage(identifier, ImageType.BODY),
        (identifier: string) => this.assetsService.getSkillImage(identifier, ImageType.BODY),
        (a, b) => a.name.localeCompare(b.name));
    }

    public onCharacterSelect(id: CharacterID | null): void {
      this.teamService.updateMemberCharacter(this.member.id, id);
    }

    public onEmblemSelect(id: EmblemID | null): void {
      this.teamService.updateMemberEmblem(this.member.id, id);
    }

    public onClassSelect(id: ClassID | null): void {
      this.teamService.updateMemberClass(this.member.id, id);
    }

    public onWeaponSelect(id: WeaponID | null, weaponIndex: number): void {
      if (weaponIndex < 0 || weaponIndex >= this.member.weapons.length) {
        console.error(`Invalid weapon index: ${weaponIndex}`);
        return;
      }
      this.teamService.updateMemberWeapon(this.member.id, weaponIndex, id);
    }

    public onSkillSelect(id: SkillID | null, skillIndex: number): void {
      if (skillIndex < 0 || skillIndex >= this.member.inheritableSkills.length) {
        console.error(`Invalid skill index: ${skillIndex}`);
        return;
      }
      this.teamService.updateMemberInheritableSkill(this.member.id, skillIndex, id);
    }

    viewCharacterDetails(): void {
      this.viewStateService.openPanel();
      const character: Character | null = this.member.character;
      if (character) {
        this.viewStateService.setSelectedCharacterId(character.id);
        this.viewStateService.setView(ViewType.CHARACTERS);
      }
    }

    viewEmblemDetails(): void {
      this.viewStateService.openPanel();
      const emblem: Emblem | null = this.member.emblem;
      if (emblem) {
        this.viewStateService.setSelectedEmblemId(emblem.id);
        this.viewStateService.setView(ViewType.EMBLEMS);
      }
    }

    viewWeaponDetails(weaponIndexSlot: number): void {
      this.viewStateService.openPanel();
      const weapon: Weapon | null = this.member.weapons[weaponIndexSlot];
      if (weapon) {
        this.viewStateService.setSelectedWeaponId(weapon.id);
        this.viewStateService.setView(ViewType.WEAPONS);
      }
    }

    public getResourceSelectItemIconOptions<T extends {
        id: U;
        name: string;
        identifier: string
    }, U extends ResourceID>(
      resources: T[],
      getImageUrl: (identifier: string) => string,
      getSelectedImageUrl: (identifier: string) => string,
      sortComparator: (a: T, b: T) => number,
      getBorderColor?: (resource: T) => string
    ): SelectOptionIcon<U>[] {
      return resources.sort(sortComparator).map((resource: T) => ({
        id: resource.id,
        name: resource.name,
        itemUrl: getImageUrl(resource.identifier),
        selectedItemUrl: getSelectedImageUrl(resource.identifier),
        borderColor: getBorderColor ? getBorderColor(resource) : '#808080'
      }));
    }

    public getResourceSelectItemOptions<T extends { id: U; name: string; identifier: string }, U extends ResourceID>(
      resources: T[],
      sortComparator: (a: T, b: T) => number,
      getItemUrl: (identifier: string) => string[],
      getBorderColor?: (resource: T) => string
    ): SelectOptionLabel<U>[] {
      return resources.sort(sortComparator).map((resource: T) => ({
        id: resource.id,
        name: resource.name,
        borderColor: getBorderColor ? getBorderColor(resource) : '#808080',
        secondaryItemsUrl: getItemUrl(resource.identifier)
      }));
    }
}
