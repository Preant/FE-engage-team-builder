import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { TeamMemberCardComponent } from '@/app/components/team-builder/team-member-card.component';
import { Role } from '@/app/models/Role.enum';
import { TeamMember } from '@/app/models/Team.model';
import { TeamService } from '@/app/services/team.service';

@Component({
  selector: 'app-team-builder',
  imports: [CommonModule, TeamMemberCardComponent, InputTextModule, FormsModule],
  template: `
    <div class="h-full w-full bg-gradient-to-br from-rich_black-400/50 to-gunmetal-500/50 p-4 space-y-4 overflow-y-auto">
      <div class="mb-6">
        <div class="flex items-center gap-2">
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
      </div>

      @for (member of displayedMembers(); track member.id) {
        <app-team-member-card
          [member]="member"
        />
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
}
