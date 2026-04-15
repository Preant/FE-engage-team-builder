import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';

import { TeamMemberCardComponent } from '@/app/components/team-builder/team-member-card.component';
import { TeamMemberCompactCardComponent } from '@/app/components/team-builder/team-member-compact-card.component';
import { Role } from '@/app/models/Role.enum';
import { TeamMember } from '@/app/models/Team.model';
import { TeamService } from '@/app/services/team.service';
import { getRoleIcon, canMemberHeal } from '@/app/utils/role.utils';

@Component({
  selector: 'app-team-builder',
  imports: [CommonModule, TeamMemberCardComponent, TeamMemberCompactCardComponent, InputTextModule, FormsModule, TooltipModule],
  template: `
    <div class="h-full w-full overflow-y-auto">
      <div class="sticky top-0 z-10 bg-gradient-to-br from-rich_black-400/50 to-gunmetal-500/50 p-4 border-b border-air_superiority_blue-500/20 space-y-4">
        <div class="flex items-center gap-2 justify-between">
          <div>
          @if (isEditing) {
            <input
              pInputText
              type="text"
              [(ngModel)]="editedName"
              (keyup.enter)="saveName()"
              (blur)="saveName()"
              class="p-inputtext-sm"
              #nameInput
            />
          } @else {
            <h2
              class="text-2xl font-bold text-baby_powder-500 hover:text-air_superiority_blue-500 cursor-pointer"
              (click)="startEditing()"
            >
              {{ team()?.name }}
            </h2>
          }
          </div>
          <button
            class="pi text-lg cursor-pointer hover:text-air_superiority_blue-400 transition-colors"
            [class.pi-list]="viewMode() === 'normal'"
            [class.pi-th-large]="viewMode() === 'compact'"
            (click)="toggleViewMode()"
            [attr.title]="viewMode() === 'normal' ? 'Switch to compact view' : 'Switch to normal view'"
            pTooltip="Toggle view"
            tooltipPosition="left">
          </button>
        </div>

        <div class="flex items-center gap-3 text-sm flex-wrap">
          <div class="flex items-center gap-1.5 cursor-help" pTooltip="Tank" tooltipPosition="bottom" [showDelay]="800">
            <span [class]="'pi ' + getRoleIcon(Role.TANK) + ' text-air_superiority_blue-500'"></span>
            <span class="font-semibold text-baby_powder-500">{{ roleStats()[Role.TANK] }}</span>
          </div>
          <div class="flex items-center gap-1.5 cursor-help" pTooltip="DPS" tooltipPosition="bottom" [showDelay]="800">
            <span [class]="'pi ' + getRoleIcon(Role.DPS) + ' text-red-500'"></span>
            <span class="font-semibold text-baby_powder-500">{{ roleStats()[Role.DPS] }}</span>
          </div>
          <div class="flex items-center gap-1.5 cursor-help" pTooltip="Bruiser" tooltipPosition="bottom" [showDelay]="800">
            <span [class]="'pi ' + getRoleIcon(Role.BRUISER) + ' text-orange-500'"></span>
            <span class="font-semibold text-baby_powder-500">{{ roleStats()[Role.BRUISER] }}</span>
          </div>
          <div class="flex items-center gap-1.5 cursor-help" pTooltip="Scout" tooltipPosition="bottom" [showDelay]="800">
            <span [class]="'pi ' + getRoleIcon(Role.SCOUT) + ' text-blue-500'"></span>
            <span class="font-semibold text-baby_powder-500">{{ roleStats()[Role.SCOUT] }}</span>
          </div>
          <div class="flex items-center gap-1.5 cursor-help" pTooltip="Support" tooltipPosition="bottom" [showDelay]="800">
            <span [class]="'pi ' + getRoleIcon(Role.SUPPORT) + ' text-indigo-500'"></span>
            <span class="font-semibold text-baby_powder-500">{{ roleStats()[Role.SUPPORT] }}</span>
          </div>
          <div class="flex items-center gap-1.5 cursor-help" pTooltip="Soigneur" tooltipPosition="bottom" [showDelay]="800">
            <span [class]="'pi ' + getRoleIcon(Role.HEALER) + ' text-emerald-400'"></span>
            <span class="font-semibold text-emerald-400">{{ healerCount() }}</span>
          </div>
          <div class="flex items-center gap-1.5 border-l border-air_superiority_blue-500/20 pl-3 cursor-help" pTooltip="Peut soigner (Staff, classe, emblème)" tooltipPosition="bottom" [showDelay]="800">
            <span class="pi pi-heart-fill text-red-500"></span>
            <span class="font-semibold text-red-400">{{ canHealCount() }}</span>
          </div>
        </div>
      </div>

      @if (viewMode() === 'normal') {
        <div class="bg-gradient-to-br from-rich_black-400/50 to-gunmetal-500/50 p-4 space-y-4">
          @for (member of displayedMembers(); track member.id) {
            <app-team-member-card
              [member]="member"
            />
          }
        </div>
      } @else {
        <div class="bg-gradient-to-br from-rich_black-400/50 to-gunmetal-500/50 p-2 flex flex-wrap gap-2 overflow-auto justify-center items-start content-start">
          @for (member of displayedMembers(); track member.id) {
            <app-team-member-compact-card
              [member]="member"
            />
          }
        </div>
      }
    </div>
  `,
  standalone: true,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class TeamBuilderComponent {
  protected isEditing = false;
  protected editedName = '';
  protected readonly Role = Role;
  protected readonly getRoleIcon = getRoleIcon;
  protected viewMode: WritableSignal<'normal' | 'compact'> = signal('normal');

  private readonly teamService: TeamService = inject(TeamService);

  protected team = this.teamService.activeTeam;

  protected displayedMembers = computed(() => {
    const currentTeam = this.team();
    if (!currentTeam) {return [];}

    const roleOrder: Record<Role | 'NONE', number> = {
      [Role.TANK]: 0,
      [Role.DPS]: 1,
      [Role.BRUISER]: 2,
      [Role.SCOUT]: 3,
      [Role.SUPPORT]: 4,
      [Role.HEALER]: 5,
      'NONE': 6
    };

    return [...currentTeam.members].sort((a: TeamMember, b: TeamMember) => {
      const aRole = a.role ?? 'NONE';
      const bRole = b.role ?? 'NONE';
      return roleOrder[aRole] - roleOrder[bRole];
    });
  });

  protected roleStats = computed(() => {
    const currentTeam = this.team();
    if (!currentTeam) {
      return {
        [Role.TANK]: 0,
        [Role.DPS]: 0,
        [Role.BRUISER]: 0,
        [Role.SCOUT]: 0,
        [Role.SUPPORT]: 0,
        [Role.HEALER]: 0
      };
    }

    const stats = {
      [Role.TANK]: 0,
      [Role.DPS]: 0,
      [Role.BRUISER]: 0,
      [Role.SCOUT]: 0,
      [Role.SUPPORT]: 0,
      [Role.HEALER]: 0
    };

    currentTeam.members.forEach((member: TeamMember) => {
      if (member.role) {
        stats[member.role]++;
      }
    });

    return stats;
  });

  protected healerCount = computed(() => {
    const currentTeam = this.team();
    if (!currentTeam) return 0;

    return currentTeam.members.filter((member: TeamMember) =>
      member.role === Role.HEALER
    ).length;
  });

  protected canHealCount = computed(() => {
    const currentTeam = this.team();
    if (!currentTeam) return 0;

    return currentTeam.members.filter(canMemberHeal).length;
  });

  startEditing(): void {
    const currentTeam = this.team();
    if (currentTeam) {
      this.editedName = currentTeam.name;
      this.isEditing = true;
    }
  }

  saveName(): void {
    const currentTeam = this.team();
    if (currentTeam && this.editedName.trim() && this.editedName !== currentTeam.name) {
      this.teamService.updateTeamName(currentTeam.id, this.editedName.trim());
    }
    this.isEditing = false;
  }

  toggleViewMode(): void {
    this.viewMode.set(this.viewMode() === 'normal' ? 'compact' : 'normal');
  }
}
