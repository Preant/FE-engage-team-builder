import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { TeamMemberCardComponent } from '@/app/components/team-builder/team-member-card.component';
import { Team } from '@/app/models/Team.model';
import { TeamService } from '@/app/services/team.service';
import { ViewStateService } from '@/app/services/view-state.service';

@Component({
  selector: 'app-team-builder',
  imports: [CommonModule, TeamMemberCardComponent, ButtonModule],
  template: `
        <div class="h-full w-full bg-gradient-to-br from-rich_black-400/50 to-gunmetal-500/50 p-4 space-y-4 overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <div class="flex items-center gap-4">
                    <p-button icon="pi pi-home" (click)="goBack()"/>
                    <h2 class="text-2xl font-bold text-baby_powder-500">{{ team.name }}</h2>
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
    private readonly teamService: TeamService = inject(TeamService);
    private readonly viewStateService: ViewStateService = inject(ViewStateService);

    public toggleResourcesPanel(): void {
      this.viewStateService.setIsResourcesPanelOpen(!this.viewStateService.getIsResourcesPanelOpen()());
    }

    public goBack(): void {
      this.teamService.switchTeam(null);
    }

}
