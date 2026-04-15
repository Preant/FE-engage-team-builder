import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { Team } from '@/app/models/Team.model';
import { TeamService } from '@/app/services/team.service';
import { ViewStateService } from '@/app/services/view-state.service';

@Component({
  selector: 'app-sidebar-nav',
  imports: [CommonModule, ButtonModule, TooltipModule],
  template: `
    <div class="flex flex-col h-full items-center py-3 gap-3 bg-gradient-to-b from-rich_black-500 to-prussian_blue-500 shadow-lg w-[52px]">
      <!-- Home -->
      <p-button
        icon="pi pi-home"
        [text]="true"
        severity="secondary"
        pTooltip="Accueil"
        tooltipPosition="right"
        (click)="goHome()"/>

      <!-- Resources toggle -->
      <p-button
        icon="pi pi-th-large"
        [text]="true"
        [severity]="isResourcesPanelOpen() ? 'info' : 'secondary'"
        pTooltip="Ressources"
        tooltipPosition="right"
        (click)="toggleResources()"/>

      <!-- New Team -->
      <p-button
        icon="pi pi-plus"
        [text]="true"
        severity="secondary"
        pTooltip="Nouveau Team"
        tooltipPosition="right"
        (click)="createTeam()"/>

      <!-- Import Team -->
      <p-button
        icon="pi pi-upload"
        [text]="true"
        severity="secondary"
        pTooltip="Importer Team"
        tooltipPosition="right"
        (click)="fileInput.click()"/>
      <input
        #fileInput
        type="file"
        accept=".json"
        hidden
        (change)="onFileSelected($event)"/>
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
export class SidebarNavComponent {
  private readonly teamService: TeamService = inject(TeamService);
  private readonly viewStateService: ViewStateService = inject(ViewStateService);

  readonly activeTeam: Signal<Team | null> = this.teamService.activeTeam;
  readonly isResourcesPanelOpen: Signal<boolean> = this.viewStateService.getIsResourcesPanelOpen();

  public goHome(): void {
    this.teamService.switchTeam(null);
  }

  public toggleResources(): void {
    this.viewStateService.setIsResourcesPanelOpen(!this.isResourcesPanelOpen());
  }

  public createTeam(): void {
    this.teamService.createTeam();
  }

  public onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.importTeam(file);
      input.value = '';
    }
  }

  private importTeam(file: File): void {
    const reader: FileReader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const importedTeam: Team = JSON.parse(e.target?.result as string);
        this.teamService.importTeam(importedTeam);
      } catch (error) {
        console.error('Error importing team:', error);
      }
    };
    reader.readAsText(file);
  }
}
