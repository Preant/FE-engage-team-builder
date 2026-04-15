import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { TeamID } from '@/app/brands/ResourceID.brand';
import { TeamCardComponent } from '@/app/components/team-builder/team-card.component';
import { Team } from '@/app/models/Team.model';
import { TeamService } from '@/app/services/team.service';

@Component({
  selector: 'app-team-selector',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    TeamCardComponent
  ],
  template: `
        <div class="h-full w-full bg-gradient-to-br from-rich_black-400/50 to-gunmetal-500/50 p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                @for (team of sortedTeams(); track team.id) {
                    <app-team-card
                            [team]="team"
                            (onSelect)="selectTeam($event)"
                            (onDelete)="showDeleteConfirmation($event)"
                            (onExport)="exportTeam($event)"
                    />
                }
            </div>

            <!-- Delete Confirmation Dialog -->
            <p-dialog
                    [(visible)]="showDeleteDialog"
                    header="Confirm Deletion"
                    [modal]="true"
                    [style]="{width: '450px'}"
                    [draggable]="false"
                    [resizable]="false"
                    class="bg-gradient-to-br from-prussian_blue-400/95 to-prussian_blue-600/95"
            >
                <div class="confirmation-content">
                    <i class="pi pi-exclamation-triangle mr-3 text-mauve-500" style="font-size: 2rem"></i>
                    <span>Are you sure you want to delete the team "{{ teamToDelete?.name }}"?</span>
                </div>
                <ng-template pTemplate="footer">
                    <p-button
                            icon="pi pi-times"
                            label="No"
                            (click)="hideDeleteDialog()"
                            class="p-button-text"
                    ></p-button>
                    <p-button
                            icon="pi pi-check"
                            label="Yes"
                            (click)="confirmDelete()"
                            class="p-button-danger"
                    ></p-button>
                </ng-template>
            </p-dialog>
        </div>
    `,
  styles: [`
        :host ::ng-deep .p-dialog {
            .p-dialog-header {
                background: transparent;
                color: #fff;
                border-bottom: 1px solid var(--prussian-blue-300);
            }

            .p-dialog-content {
                background: transparent;
                color: #fff;
                padding: 2rem;
            }

            .p-dialog-footer {
                background: transparent;
                border-top: 1px solid var(--prussian-blue-300);
                padding: 1.5rem;
            }

            .confirmation-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 1rem;
            }
        }
    `]
})
export class TeamSelectorComponent {
  readonly sortedTeams: Signal<Team[]> = computed(
    (): Team[] => this.teams().sort((a, b) => a.id - b.id)
  );
  protected showDeleteDialog: boolean = false;
  protected teamToDelete: Team | null = null;
  private readonly teamService: TeamService = inject(TeamService);
  readonly teams: Signal<Team[]> = this.teamService.teams;

  selectTeam(teamId: TeamID): void {
    this.teamService.switchTeam(teamId);
  }

  exportTeam(teamId: TeamID): void {
    const teamToExport: Team = this.teamService.getTeamById(teamId);
    const blob: Blob = new Blob([JSON.stringify(teamToExport, null, 2)], {
      type: 'application/json'
    });
    const url: string = window.URL.createObjectURL(blob);
    const link: HTMLAnchorElement = document.createElement('a');
    link.href = url;
    link.download = `team_export_${new Date().toISOString().replace(/:/g, '-')}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  protected showDeleteConfirmation(team: Team): void {
    this.teamToDelete = team;
    this.showDeleteDialog = true;
  }

  protected hideDeleteDialog(): void {
    this.showDeleteDialog = false;
    this.teamToDelete = null;
  }

  protected confirmDelete(): void {
    if (this.teamToDelete) {
      this.teamService.deleteTeam(this.teamToDelete.id);
    }
    this.hideDeleteDialog();
  }
}
