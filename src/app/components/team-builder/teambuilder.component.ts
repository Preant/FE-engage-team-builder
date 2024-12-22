import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { TeamMemberCardComponent } from '@/app/components/team-builder/team-member-card.component';
import { Team } from '@/app/models/Team.model';
import { TeamService } from '@/app/services/team.service';
import { ViewStateService } from '@/app/services/view-state.service';

@Component({
  selector: 'app-team-builder',
  imports: [CommonModule, TeamMemberCardComponent, ButtonModule, InputTextModule, FormsModule],
  template: `
    <div class="h-full w-full bg-gradient-to-br from-rich_black-400/50 to-gunmetal-500/50 p-4 space-y-4 overflow-y-auto">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
          <p-button icon="pi pi-home" (click)="goBack()"/>

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
                {{ team.name }}
              </h2>
            }
          </div>
        </div>

        <p-button
          label="Resources"
          class="p-button-rounded p-button-text"
          (click)="toggleResourcesPanel()"
        ></p-button>
      </div>

      @for (member of team.members; track member.id) {
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
    @Input() team!: Team;

    protected isEditing = false;
    protected editedName = '';

    private readonly teamService: TeamService = inject(TeamService);
    private readonly viewStateService: ViewStateService = inject(ViewStateService);

    public toggleResourcesPanel(): void {
      this.viewStateService.setIsResourcesPanelOpen(!this.viewStateService.getIsResourcesPanelOpen()());
    }

    public goBack(): void {
      this.teamService.switchTeam(null);
    }

    startEditing(): void {
      this.editedName = this.team.name;
      this.isEditing = true;
    }

    saveName(): void {
      if (this.editedName.trim() && this.editedName !== this.team.name) {
        this.teamService.updateTeamName(this.team.id, this.editedName.trim());
      }
      this.isEditing = false;
    }
}
