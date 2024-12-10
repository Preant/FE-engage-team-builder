import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { TeamMemberCardComponent } from './team-member-card.component';

import { TeamService } from '@/app/services/team.service';

@Component({
    selector: 'app-team-builder',
    imports: [CommonModule, TeamMemberCardComponent],
    template: `
        <div class="h-full bg-gradient-to-br from-rich_black-400/50 to-gunmetal-500/50 p-4 space-y-4 overflow-y-auto">
            <h2 class="text-2xl font-bold text-baby_powder-500 mb-6">Team Builder</h2>

            @for (member of teamMembers(); track member.id) {
                <app-team-member-card
                        [memberId]="member.id"
                />
            }
        </div>
    `,
    styles: [`
        :host {
            display: block;
            height: 100%;
        }
    `]
})
export class TeamBuilderComponent {
  private readonly teamService = inject(TeamService);
  readonly teamMembers = this.teamService.members;
}
