import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';

import { TeamID } from '@/app/brands/ResourceID.brand';
import { TeamCardComponent } from '@/app/components/team-builder/team-card.component';
import { Team } from '@/app/models/Team.model';
import { TeamService } from '@/app/services/team.service';
import { ViewStateService } from '@/app/services/view-state.service';

@Component({
  selector: 'app-team-selector',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FileUploadModule,
    DialogModule,
    TeamCardComponent
  ],
  template: `
        <div class="h-full w-full bg-gradient-to-br from-rich_black-400/50 to-gunmetal-500/50 p-4">
            <div class="flex justify-between items-center mb-8">
                <h2 class="text-2xl font-bold text-baby_powder-500">Teams</h2>
                <div class="flex items-center space-x-2">
                    <p-button
                            label="New Team"
                            class="p-button-rounded"
                            (click)="createTeam()"
                    ></p-button>
                    <p-fileUpload
                            #fileUpload
                            mode="basic"
                            accept=".json"
                            chooseLabel="Import Team"
                            (onSelect)="importTeam($event.files[0])"
                    ></p-fileUpload>
                    <p-button
                            label="Resources"
                            class="p-button-rounded p-button-text"
                            (click)="toggleResourcesPanel()"
                    ></p-button>
                </div>
            </div>

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
  private readonly viewStateService: ViewStateService = inject(ViewStateService);

  toggleResourcesPanel(): void {
    this.viewStateService.setIsResourcesPanelOpen(
      !this.viewStateService.getIsResourcesPanelOpen()()
    );
  }

  selectTeam(teamId: TeamID): void {
    this.teamService.switchTeam(teamId);
  }

  createTeam(): void {
    this.teamService.createTeam();
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

  importTeam(file: File): void {
    const reader: FileReader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const importedTeam: Team = JSON.parse(e.target?.result as string);
        this.teamService.importTeam(importedTeam);
        const uploadButton: any = document.querySelector('p-fileUpload');
        uploadButton.clear();
      } catch (error) {
        console.error('Error importing team:', error);
      }
    };
    reader.readAsText(file);
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
