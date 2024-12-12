import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TeamMemberCardComponent } from '@/app/components/team-builder/team-member-card.component';
import { Team } from '@/app/models/Team.model';

@Component({
  selector: 'app-team-builder',
  imports: [CommonModule, TeamMemberCardComponent],
  template: `
        <div class="h-full bg-gradient-to-br from-rich_black-400/50 to-gunmetal-500/50 p-4 space-y-4 overflow-y-auto">
            <h2 class="text-2xl font-bold text-baby_powder-500 mb-6">Team Builder</h2>

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
}
