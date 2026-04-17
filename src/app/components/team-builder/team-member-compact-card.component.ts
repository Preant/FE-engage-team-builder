import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, Signal, signal, WritableSignal } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

import { Emblem } from '@/app/models/Emblem.model';
import { ImageType } from '@/app/models/ImageSize.enum';
import { Role } from '@/app/models/Role.enum';
import { Skill } from '@/app/models/Skill.model';
import { Staff } from '@/app/models/Staff.model';
import { TeamMember, isWeapon } from '@/app/models/Team.model';
import { Weapon } from '@/app/models/Weapon.model';
import { AssetsService } from '@/app/services/assets.service';
import { ColorService } from '@/app/services/Color.service';
import { TeamService } from '@/app/services/team.service';
import { getRoleIcon, getRoleBgClass, canMemberHeal } from '@/app/utils/role.utils';

@Component({
  selector: 'app-team-member-compact-card',
  imports: [CommonModule, TooltipModule],
  standalone: true,
  template: `
    <div
      class="relative bg-gradient-to-br from-gunmetal-400/50 to-gunmetal-600/50 rounded-lg p-2 border border-rich_black-500 flex flex-col gap-2 overflow-hidden w-40 h-64"
      [style.backgroundImage]="member().character ? 'url(' + assetsService.getCharacterImage(member().character!.identifier, ImageType.BODY) + ')' : 'none'"
      [style.backgroundSize]="'cover'"
      [style.backgroundPosition]="'center'"
      [style.backgroundAttachment]="'local'">

      <!-- Background overlay -->
      <div class="absolute inset-0 bg-black/30 pointer-events-none"></div>

      <!-- Content overlay -->
      <div class="relative z-10 flex flex-col h-full justify-between">
        <!-- Top: Role + Healing Indicator -->
        <div class="flex items-start justify-between">
          <!-- Role Thumbnail (Top Left) -->
          <div class="flex-shrink-0 relative">
            <div
              class="w-10 h-10 rounded cursor-pointer transition-all hover:opacity-80 flex items-center justify-center"
              [ngClass]="getRoleThumbnailClass()"
              (click)="isRoleMenuOpen.set(!isRoleMenuOpen())"
              [pTooltip]="member().role ?? 'Click to assign role'"
              tooltipPosition="bottom">
              @if (member().role) {
                <span [class]="'pi ' + getRoleIcon(member().role) + ' text-sm'"></span>
              } @else {
                <div class="text-sm text-gray-400">+</div>
              }
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

          <!-- Right side indicators -->
          <div class="flex flex-col items-end gap-0.5">
            <!-- Healing indicator -->
            @if (hasHealingAccess()) {
              <div>
                <span class="pi pi-heart-fill text-red-500 text-sm" style="text-shadow: 0 0 3px rgba(0,0,0,0.8);" pTooltip="Peut soigner" tooltipPosition="top"></span>
              </div>
            }
            <!-- Pact Ring Toggle -->
            <div class="cursor-pointer"
                 (click)="togglePactRing()"
                 [pTooltip]="pactRingTooltipText()"
                 tooltipPosition="top">
              <span class="pi pi-circle-fill text-sm transition-all"
                    [ngClass]="isPactRingBearer() ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-600/60'"
                    [style]="isPactRingBearer() ? 'text-shadow: 0 0 6px rgba(234,179,8,0.8);' : ''">
              </span>
            </div>
          </div>
        </div>

        <!-- Bottom: Class + Emblem + Skills + Weapons -->
        <div class="flex flex-col gap-1.5">
          <!-- Class with name + Emblem -->
          <div class="flex gap-1.5 items-center flex-wrap">
            <!-- Class with name -->
            <div class="flex flex-col gap-0.5 items-center">
              @if (member().class) {
                <div
                  class="w-10 h-10 rounded flex items-center justify-center overflow-hidden border flex-shrink-0"
                  [style.border-color]="colorService.getColorForClassType(member().class!)"
                  [pTooltip]="member().class?.name"
                  tooltipPosition="bottom">
                  <img
                    [src]="assetsService.getWeaponTypeImage(member().class!.weapons[0][0])"
                    alt="Class"
                    class="w-full h-full object-cover">
                </div>
                <span class="text-xs text-baby_powder-400 text-center font-medium line-clamp-1 w-10">{{ member().class!.name }}</span>
              }
            </div>

            <!-- Emblem -->
            @if (member().emblem) {
              <div
                class="w-10 h-10 rounded flex items-center justify-center overflow-hidden border border-gray-600 flex-shrink-0 bg-black/60"
                [pTooltip]="member().emblem?.name"
                tooltipPosition="bottom">
                <img
                  [src]="assetsService.getEmblemImage(member().emblem!.identifier, ImageType.BODY_SMALL)"
                  alt="Emblem"
                  class="w-full h-full object-cover">
              </div>
            }
          </div>

          <!-- Skills + Weapons -->
          <div class="flex gap-1 flex-wrap">
          @for (skill of member().inheritableSkills; track $index) {
            @if (skill) {
              <div
                class="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center overflow-hidden border border-gray-600"
                [pTooltip]="skill.name"
                tooltipPosition="bottom">
                <img
                  [src]="assetsService.getSkillImage(skill.identifier, ImageType.BODY)"
                  alt="Skill"
                  class="w-full h-full object-cover">
              </div>
            }
          }
          @for (weapon of member().weapons; track $index) {
            @if (weapon) {
              <div
                class="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center overflow-hidden border"
                [style.border-color]="getWeaponBorderColor(weapon)"
                [pTooltip]="weapon.name"
                tooltipPosition="bottom">
                <img
                  [src]="getWeaponImageUrl(weapon)"
                  alt="Weapon"
                  class="w-full h-full object-cover">
              </div>
            }
          }
        </div>
      </div>
    </div>
  `
})
export class TeamMemberCompactCardComponent {
  member = input.required<TeamMember>();
  isPactRingBearer = input<boolean>(false);
  protected readonly Role = Role;
  protected readonly ImageType = ImageType;

  protected readonly roles = [
    { value: Role.TANK, label: 'Tank' },
    { value: Role.DPS, label: 'DPS' },
    { value: Role.BRUISER, label: 'Bruiser' },
    { value: Role.SCOUT, label: 'Scout' },
    { value: Role.SUPPORT, label: 'Support' }
  ];
  protected isRoleMenuOpen: WritableSignal<boolean> = signal(false);
  protected hasHealingAccess!: Signal<boolean>;

  protected readonly colorService: ColorService = inject(ColorService);
  protected readonly assetsService: AssetsService = inject(AssetsService);
  private readonly teamService: TeamService = inject(TeamService);

  ngOnInit() {
    this.hasHealingAccess = computed(() => canMemberHeal(this.member()));
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
    return this.isPactRingBearer() ? "Retirer l'Anneau du Pacte" : "Porteur de l'Anneau du Pacte";
  }

  getWeaponImageUrl(weapon: Weapon | Staff): string {
    return isWeapon(weapon)
      ? this.assetsService.getWeaponImage(weapon.identifier, ImageType.BODY)
      : this.assetsService.getStaffImage(weapon.identifier, ImageType.BODY);
  }

  getWeaponBorderColor(weapon: Weapon | Staff): string {
    return isWeapon(weapon)
      ? this.colorService.getColorForWeapon(weapon)
      : this.colorService.getColorForStaff(weapon);
  }
}
