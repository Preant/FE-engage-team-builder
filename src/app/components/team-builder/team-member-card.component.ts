import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

import { CharacterID, ClassID, EmblemID, SkillID, StaffID, WeaponID } from '@/app/brands/ResourceID.brand';
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
import { Role } from '@/app/models/Role.enum';
import { Skill } from '@/app/models/Skill.model';
import { Staff } from '@/app/models/Staff.model';
import { TeamMember, isWeapon } from '@/app/models/Team.model';
import { ViewType } from '@/app/models/ViewType.enum';
import { Weapon } from '@/app/models/Weapon.model';
import { AssetsService } from '@/app/services/assets.service';
import { ColorService } from '@/app/services/Color.service';
import { ClassService } from '@/app/services/resources.service';
import { TeamService } from '@/app/services/team.service';
import { ViewStateService } from '@/app/services/view-state.service';
import { getOrdinal } from '@/app/utils/getOrdinal';
import { getRoleIcon, getRoleBgClass, canMemberHeal } from '@/app/utils/role.utils';

@Component({
  selector: 'app-team-member-card',
  imports: [CommonModule, FormsModule, SelectComponent, TooltipModule],
  standalone: true,
  template: `
        <div class="relative bg-gradient-to-br from-gunmetal-400/50 to-gunmetal-600/50 rounded-lg p-2 border border-rich_black-500 m-4 flex gap-3">
            <!-- Healing Access Indicator -->
            @if (hasHealingAccess()) {
                <div class="absolute left-1 top-1 z-10">
                    <span class="pi pi-heart-fill text-red-500 text-lg" style="text-shadow: 0 0 3px rgba(0,0,0,0.8); -webkit-text-stroke: 1px rgba(0,0,0,0.6);"></span>
                </div>
            }

            <!-- Pact Ring Toggle -->
            <div class="absolute left-1 top-6 z-10 cursor-pointer"
                 (click)="togglePactRing()"
                 [pTooltip]="pactRingTooltipText()"
                 tooltipPosition="right">
              <span class="pi pi-circle-fill text-lg transition-all"
                    [ngClass]="isPactRingBearer() ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-600/60'"
                    [style]="isPactRingBearer() ? 'text-shadow: 0 0 8px rgba(234,179,8,0.9); -webkit-text-stroke: 1px rgba(0,0,0,0.5);' : ''">
              </span>
            </div>

            <!-- Role Thumbnail -->
            <div class="flex-shrink-0 relative">
                <div
                    class="w-16 h-full rounded cursor-pointer transition-all hover:opacity-80 flex items-center justify-center"
                    [ngClass]="getRoleThumbnailClass()"
                    (click)="isRoleMenuOpen.set(!isRoleMenuOpen())">
                    <span class="text-center">
                        @if (member().role) {
                            <span [class]="'pi ' + getRoleIcon(member().role) + ' text-xl'"></span>
                        } @else {
                            <div class="text-2xl text-gray-400">+</div>
                        }
                    </span>
                </div>

                <!-- Role Menu Overlay -->
                @if (isRoleMenuOpen()) {
                    <div class="absolute top-full left-0 mt-1 bg-rich_black-700 border-2 border-air_superiority_blue-600 rounded shadow-2xl z-50 min-w-40">
                        <button
                            class="w-full px-4 py-2 text-left text-sm text-baby_powder-300 hover:bg-rich_black-600 transition-colors flex items-center justify-between font-medium"
                            [class.bg-air_superiority_blue-700]="member().role === roles[0].value"
                            (click)="setRoleAndClose(roles[0].value)">
                            <span>Tank</span>
                            @if (member().role === roles[0].value) {
                                <span class="pi pi-check text-xs text-air_superiority_blue-300"></span>
                            }
                        </button>
                        <button
                            class="w-full px-4 py-2 text-left text-sm text-baby_powder-300 hover:bg-rich_black-600 transition-colors flex items-center justify-between font-medium"
                            [class.bg-red-700]="member().role === roles[1].value"
                            (click)="setRoleAndClose(roles[1].value)">
                            <span>DPS</span>
                            @if (member().role === roles[1].value) {
                                <span class="pi pi-check text-xs text-red-300"></span>
                            }
                        </button>
                        <button
                            class="w-full px-4 py-2 text-left text-sm text-baby_powder-300 hover:bg-rich_black-600 transition-colors flex items-center justify-between font-medium"
                            [class.bg-orange-700]="member().role === roles[2].value"
                            (click)="setRoleAndClose(roles[2].value)">
                            <span>Bruiser</span>
                            @if (member().role === roles[2].value) {
                                <span class="pi pi-check text-xs text-orange-300"></span>
                            }
                        </button>
                        <button
                            class="w-full px-4 py-2 text-left text-sm text-baby_powder-300 hover:bg-rich_black-600 transition-colors flex items-center justify-between font-medium"
                            [class.bg-blue-600]="member().role === roles[3].value"
                            (click)="setRoleAndClose(roles[3].value)">
                            <span>Scout</span>
                            @if (member().role === roles[3].value) {
                                <span class="pi pi-check text-xs text-blue-300"></span>
                            }
                        </button>
                        <button
                            class="w-full px-4 py-2 text-left text-sm text-baby_powder-300 hover:bg-rich_black-600 transition-colors flex items-center justify-between font-medium"
                            [class.bg-indigo-600]="member().role === roles[4].value"
                            (click)="setRoleAndClose(roles[4].value)">
                            <span>Support</span>
                            @if (member().role === roles[4].value) {
                                <span class="pi pi-check text-xs text-indigo-300"></span>
                            }
                        </button>
                        <div class="border-t border-rich_black-500"></div>
                        <button
                            class="w-full px-4 py-2 text-left text-sm text-baby_powder-300 hover:bg-rich_black-600 transition-colors flex items-center justify-between font-medium"
                            [class.bg-rich_black-500]="!member().role"
                            (click)="setRoleAndClose(null)">
                            <span>None</span>
                            @if (!member().role) {
                                <span class="pi pi-check text-xs text-baby_powder-400"></span>
                            }
                        </button>
                    </div>
                }
            </div>

            <!-- Main Content -->
            <div class="flex-1 flex flex-col space-y-4">
                <div class="flex justify-around flex-nowrap gap-2 flex-shrink">
                    <app-select
                            class="w-36 h-24"
                            [selectOptions]="characterOptions()"
                            label="Character"
                            showDetailsButton
                            (detailsButtonClicked)="viewCharacterDetails()"
                            [type]="SelectType.ICON"
                            [initialSelection]="member().character?.id"
                            (selectedItemModelChange)="onCharacterSelect($event?.id ?? null)"/>

                    <app-select
                            class="w-52 h-24"
                            [selectOptions]="classOptions()"
                            label="Class"
                            [type]="SelectType.LABEL"
                            [initialSelection]="member().class?.id"
                            (selectedItemModelChange)="onClassSelect($event?.id ?? null)"
                    />

                    <app-select
                            class="w-36 h-24"
                            [selectOptions]="emblemOptions()"
                            showDetailsButton
                            (detailsButtonClicked)="viewEmblemDetails()"
                            label="Emblem"
                            [type]="SelectType.ICON"
                            [initialSelection]="member().emblem?.id"
                            (selectedItemModelChange)="onEmblemSelect($event?.id ?? null)"/>


                    @for (skill of skillOptions; track $index) {
                        <app-select
                                class="w-36 h-24"
                                [selectOptions]="skill()"
                                showDetailsButton
                                (detailsButtonClicked)="viewSkillDetails($index)"
                                label="Skill #{{$index + 1}}"
                                [type]="SelectType.ICON"
                                [initialSelection]="member().inheritableSkills[$index]?.id"
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
                                [initialSelection]="member().weapons[$index]?.id"
                                (selectedItemModelChange)="onWeaponSelect($event?.id ?? null, $index)"/>
                    }
                </div>
            </div>
        </div>
    `
})
export class TeamMemberCardComponent {
  member = input.required<TeamMember>();
  isPactRingBearer = input<boolean>(false);
  characterOptions!: Signal<SelectOptionIcon<CharacterID>[]>;
  classOptions!: Signal<SelectOptionLabel<ClassID>[]>;
  emblemOptions!: Signal<SelectOptionIcon<EmblemID>[]>;
  weaponsOptions!: Signal<SelectOptionIcon<WeaponID | StaffID>[]>[];
  skillOptions!: Signal<SelectOptionIcon<SkillID>[]>[];
  protected readonly SelectType: typeof SelectType = SelectType;
  protected readonly roles = [
    { value: Role.TANK, label: 'Tank' },
    { value: Role.DPS, label: 'DPS' },
    { value: Role.BRUISER, label: 'Bruiser' },
    { value: Role.SCOUT, label: 'Scout' },
    { value: Role.SUPPORT, label: 'Support' }
  ];
  protected isRoleMenuOpen: WritableSignal<boolean> = signal(false);
  protected hasHealingAccess!: Signal<boolean>;
  private readonly colorService: ColorService = inject(ColorService);
  private readonly teamService: TeamService = inject(TeamService);
  private readonly classService: ClassService = inject(ClassService);
  private readonly assetsService: AssetsService = inject(AssetsService);
  private readonly viewStateService: ViewStateService = inject(ViewStateService);

  ngOnInit() {
    this.characterOptions = computed(() => this.getCharacterOptions());
    this.classOptions = computed(() => this.getClassOptions());
    this.emblemOptions = computed(() => this.getEmblemOptions());
    this.weaponsOptions = Array(this.member().weapons.length)
      .fill(0).map((_: 0, index: number) => computed(() => this.getWeaponOptions(index)));
    this.skillOptions = Array(this.member().inheritableSkills.length)
      .fill(0).map((_: 0, index: number) => computed(() => this.getInheritableSkillOptions(index)));
    this.hasHealingAccess = computed(() => canMemberHeal(this.member()));
  }

  //Options providers
  public getCharacterOptions(): SelectOptionIcon<CharacterID>[] {
    return this.getResourceSelectItemIconOptions(this.teamService.getAvailableCharacters(this.member().id)(),
      (identifier: string) => this.assetsService.getCharacterImage(identifier, ImageType.BANNER_SMALL),
      (identifier: string) => this.assetsService.getCharacterImage(identifier, ImageType.BODY_SMALL),
      (a, b) => getOrdinal(Country, a.country) - getOrdinal(Country, b.country),
      (character: Character) => this.colorService.getColorForCharacter(character));
  }

  public getClassOptions(): SelectOptionLabel<ClassID>[] {
    return this.getResourceSelectItemOptions(this.teamService.getAvailableClasses(this.member().id)(),
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
    return this.getResourceSelectItemIconOptions(this.teamService.getAvailableEmblems(this.member().id)(),
      (identifier: string) => this.assetsService.getEmblemImage(identifier, ImageType.BANNER_SMALL),
      (identifier: string) => this.assetsService.getEmblemImage(identifier, ImageType.BODY),
      (a, b) => a.id - b.id);
  }

  public getWeaponOptions(weaponSlotIndex: number): SelectOptionIcon<WeaponID | StaffID>[] {
    const items = this.teamService.getAvailableWeapons(this.member().id, weaponSlotIndex)();
    return items.sort((a, b) => {
      const aName = a.name;
      const bName = b.name;
      return aName.localeCompare(bName);
    }).map((item: Weapon | Staff) => {
      const imageUrl = isWeapon(item)
        ? this.assetsService.getWeaponImage(item.identifier, ImageType.BODY)
        : this.assetsService.getStaffImage(item.identifier, ImageType.BODY);
      const borderColor = isWeapon(item)
        ? this.colorService.getColorForWeapon(item)
        : this.colorService.getColorForStaff(item);
      return {
        id: item.id,
        name: item.name,
        itemUrl: imageUrl,
        selectedItemUrl: imageUrl,
        borderColor: borderColor
      };
    });
  }

  public getInheritableSkillOptions(skillSlotIndex: number): SelectOptionIcon<SkillID>[] {
    return this.getResourceSelectItemIconOptions(this.teamService.getAvailableInheritableSkills(this.member().id, skillSlotIndex)(),
      (identifier: string) => this.assetsService.getSkillImage(identifier, ImageType.BODY),
      (identifier: string) => this.assetsService.getSkillImage(identifier, ImageType.BODY),
      (a, b) => a.name.localeCompare(b.name));
  }

  public onCharacterSelect(id: CharacterID | null): void {
    this.teamService.updateMemberCharacter(this.member().id, id);
  }

  public onEmblemSelect(id: EmblemID | null): void {
    this.teamService.updateMemberEmblem(this.member().id, id);
  }

  public onClassSelect(id: ClassID | null): void {
    this.teamService.updateMemberClass(this.member().id, id);
  }

  public onWeaponSelect(id: WeaponID | StaffID | null, weaponIndex: number): void {
    if (weaponIndex < 0 || weaponIndex >= this.member().weapons.length) {
      console.error(`Invalid weapon index: ${weaponIndex}`);
      return;
    }
    this.teamService.updateMemberWeapon(this.member().id, weaponIndex, id);
  }

  public onSkillSelect(id: SkillID | null, skillIndex: number): void {
    if (skillIndex < 0 || skillIndex >= this.member().inheritableSkills.length) {
      console.error(`Invalid skill index: ${skillIndex}`);
      return;
    }
    this.teamService.updateMemberInheritableSkill(this.member().id, skillIndex, id);
  }

  viewCharacterDetails(): void {
    this.viewStateService.openPanel();
    const character: Character | null = this.member().character;
    if (character) {
      this.viewStateService.setSelectedCharacterId(character.id);
      this.viewStateService.setView(ViewType.CHARACTERS);
    }
  }

  viewEmblemDetails(): void {
    this.viewStateService.openPanel();
    const emblem: Emblem | null = this.member().emblem;
    if (emblem) {
      this.viewStateService.setSelectedEmblemId(emblem.id);
      this.viewStateService.setView(ViewType.EMBLEMS);
    }
  }

  viewSkillDetails(skillIndexSlot: number): void {
    this.viewStateService.openPanel();
    const skill: Skill | null = this.member().inheritableSkills[skillIndexSlot];
    if (skill) {
      this.viewStateService.setSelectedSkillId(skill.id);
      this.viewStateService.setView(ViewType.SKILLS);
    }
  }

  viewWeaponDetails(weaponIndexSlot: number): void {
    this.viewStateService.openPanel();
    const item: Weapon | Staff | null = this.member().weapons[weaponIndexSlot];
    if (item) {
      if (isWeapon(item)) {
        this.viewStateService.setSelectedWeaponId(item.id);
        this.viewStateService.setView(ViewType.WEAPONS);
      } else {
        this.viewStateService.setSelectedStaffId(item.id);
        this.viewStateService.setView(ViewType.STAVES);
      }
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

  getRoleThumbnailClass(): string {
    return getRoleBgClass(this.member().role);
  }

  getRoleIcon(role: Role | null): string {
    return role ? getRoleIcon(role) : 'pi-circle';
  }

  setRoleAndClose(role: Role | null): void {
    this.teamService.updateMemberRole(this.member().id, role);
    this.isRoleMenuOpen.set(false);
  }

  togglePactRing(): void {
    this.teamService.setPactRingBearer(this.member().id);
  }

  pactRingTooltipText(): string {
    return this.isPactRingBearer() ? "Retirer l'Anneau du Pacte" : "Désigner comme Porteur de l'Anneau du Pacte";
  }

  private checkHealingAccess(): boolean {
    return canMemberHeal(this.member());
  }
}
