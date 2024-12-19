import { CommonModule } from '@angular/common';
import { Component, computed, inject, Signal } from '@angular/core';
import { Button } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';

import { TeamID } from '@/app/brands/ResourceID.brand';
import { Character } from '@/app/models/Character.model';
import { ImageType } from '@/app/models/ImageSize.enum';
import { Team } from '@/app/models/Team.model';
import { AssetsService } from '@/app/services/assets.service';
import { ColorService } from '@/app/services/Color.service';
import { TeamService } from '@/app/services/team.service';
import { ViewStateService } from '@/app/services/view-state.service';

@Component({
  selector: 'app-team-selector',
  standalone: true,
  imports: [CommonModule, Button, FileUpload],
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
                    <div
                            class="relative bg-gradient-to-br from-gunmetal-400/50 to-gunmetal-600/50 rounded-lg p-4 border border-rich_black-500 cursor-pointer hover:border-air_superiority_blue-500 transition-all duration-200"
                            (click)="selectTeam(team.id)"
                    >
                        <div class="flex justify-between items-center">
                            <p-button icon="pi pi-download" (click)="$event.stopPropagation(); exportTeam(team.id)"/>
                            <h3 class="text-lg font-semibold text-baby_powder-500">#{{ team.id }}</h3>
                            <h3 class="text-lg font-semibold text-baby_powder-500">{{ team.name }}</h3>
                            <button
                                    class="text-paynes_gray-500 hover:text-mauve-500 transition-colors duration-200"
                                    (click)="$event.stopPropagation(); deleteTeam(team.id)"
                            >
                                <i class="pi pi-trash"></i>
                            </button>
                        </div>

                        <div class="mt-4 flex flex-wrap gap-2">
                            @for (member of team.members; track member.id) {
                                @if (member.character) {
                                    <img
                                            [src]="getCharacterImage(member.character.identifier)"
                                            [alt]="member.character.name"
                                            class="w-12 h-12 rounded-full border-2"
                                            [style.border-color]="getCharacterColor(member.character)"
                                    >
                                } @else {
                                    <div class="w-12 h-12 rounded-full border-2 border-paynes_gray-500 bg-rich_black-500 flex items-center justify-center">
                                        <span class="text-paynes_gray-500 text-xs">Empty</span>
                                    </div>
                                }
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    `
})
export class TeamSelectorComponent {
  private readonly teamService: TeamService = inject(TeamService);
  readonly teams: Signal<Team[]> = this.teamService.teams;
  readonly sortedTeams: Signal<Team[]> = computed(() => this.teams().sort((a, b) => a.id - b.id));
  private readonly viewStateService: ViewStateService = inject(ViewStateService);
  private readonly assetsService: AssetsService = inject(AssetsService);
  private readonly colorService: ColorService = inject(ColorService);

  public toggleResourcesPanel(): void {
    this.viewStateService.setIsResourcesPanelOpen(!this.viewStateService.getIsResourcesPanelOpen()());
  }

  getCharacterImage(identifier: string): string {
    return this.assetsService.getCharacterImage(identifier, ImageType.BODY_SMALL);
  }

  getCharacterColor(character: Character): string {
    return this.colorService.getColorForCharacter(character);
  }

  selectTeam(teamId: TeamID): void {
    this.teamService.switchTeam(teamId);
  }

  createTeam(): void {
    this.teamService.createTeam();
  }

  deleteTeam(teamId: TeamID): void {
    this.teamService.deleteTeam(teamId);
  }

  exportTeam(teamId: TeamID): void {
    const teamToExport: Team = this.teamService.getTeamById(teamId);
    const blob: Blob = new Blob([JSON.stringify(teamToExport, null, 2)], { type: 'application/json' });
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
      console.log('Importing team:', e.target?.result);
      try {
        const importedTeam: Team = JSON.parse(e.target?.result as string);
        //TODO: validation
        this.teamService.importTeam(importedTeam);
        const uploadButton: any = document.querySelector('p-fileUpload');
        uploadButton.clear();
      } catch (error) {
        console.error('Error importing team:', error);
      }
    };
    reader.readAsText(file);
  }
}
