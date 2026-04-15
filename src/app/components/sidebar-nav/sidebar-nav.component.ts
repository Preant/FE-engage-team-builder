import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { Team } from '@/app/models/Team.model';
import { ViewType } from '@/app/models/ViewType.enum';
import { TeamService } from '@/app/services/team.service';
import { ViewStateService } from '@/app/services/view-state.service';

interface SidebarNavItem {
  label: string;
  icon: string;
  viewType: ViewType;
}

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

      <!-- Spacer (between import team and resource sections) -->
      <div class="flex-1"></div>

      <!-- Resource sections (always visible) -->
      <div class="flex flex-col-reverse items-center gap-2">
        <hr class="w-8 border-t border-prussian_blue-300 opacity-40"/>

        @for (item of resourceNavItems; let i = $index; track item.viewType) {
          <p-button
            [icon]="item.icon"
            [text]="true"
            [severity]="isResourcesPanelOpen() && currentView() === item.viewType ? 'info' : 'secondary'"
            [pTooltip]="item.label"
            tooltipPosition="right"
            (click)="navigateToSection(item.viewType)"/>
        }
      </div>

      <!-- Resources toggle (sticky bottom) -->
      <p-button
        icon="pi pi-th-large"
        [text]="true"
        [severity]="isResourcesPanelOpen() ? 'info' : 'secondary'"
        pTooltip="Ressources"
        tooltipPosition="right"
        (click)="toggleResources()"/>
    </div>
  `,
  standalone: true,
  styleUrls: ['./sidebar-nav.component.scss']
})
export class SidebarNavComponent {
  private readonly teamService: TeamService = inject(TeamService);
  private readonly viewStateService: ViewStateService = inject(ViewStateService);

  readonly activeTeam: Signal<Team | null> = this.teamService.activeTeam;
  readonly isResourcesPanelOpen: Signal<boolean> = this.viewStateService.getIsResourcesPanelOpen();
  readonly currentView: Signal<ViewType> = this.viewStateService.getCurrentView();

  readonly resourceNavItems: SidebarNavItem[] = [
    { label: 'Characters', icon: 'pi pi-users',    viewType: ViewType.CHARACTERS },
    { label: 'Classes',    icon: 'pi pi-id-card',  viewType: ViewType.CLASSES    },
    { label: 'Emblems',    icon: 'pi pi-star',     viewType: ViewType.EMBLEMS    },
    { label: 'Skills',     icon: 'pi pi-bolt',     viewType: ViewType.SKILLS     },
    { label: 'Weapons',    icon: 'pi pi-shield',   viewType: ViewType.WEAPONS    },
    { label: 'Staves',     icon: 'pi pi-sparkles', viewType: ViewType.STAVES     },
    { label: 'Forging',    icon: 'pi pi-wrench',   viewType: ViewType.FORGING    },
  ];

  public goHome(): void {
    this.teamService.switchTeam(null);
  }

  public toggleResources(): void {
    if (this.isResourcesPanelOpen()) {
      this.viewStateService.closePanel();
    } else {
      this.viewStateService.openPanel();
    }
  }

  public navigateToSection(viewType: ViewType): void {
    if (!this.isResourcesPanelOpen()) {
      this.viewStateService.setIsResourcesPanelOpen(true);
    }
    this.viewStateService.setView(viewType);
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
