import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { SplitAreaComponent, SplitComponent } from 'angular-split';

import { CharactersComponent } from '@/app/components/characters.component';
import { ClassesComponent } from '@/app/components/classes.component';
import { EmblemsComponent } from '@/app/components/emblems.component';
import { ResourcesMenuComponent } from '@/app/components/resources-menu.component';
import { SkillsComponent } from '@/app/components/skills.component';
import { TeamSelectorComponent } from '@/app/components/team-builder/team-selector.component';
import { TeamBuilderComponent } from '@/app/components/team-builder/teambuilder.component';
import { NavbarComponent } from '@/app/header/navbar.component';
import { Team } from '@/app/models/Team.model';
import { ViewType } from '@/app/models/ViewType.enum';
import { TeamService } from '@/app/services/team.service';
import { ViewStateService } from '@/app/services/view-state.service';

@Component({
  imports: [
    CommonModule,
    ResourcesMenuComponent,
    SplitComponent,
    SplitAreaComponent,
    NavbarComponent,
    EmblemsComponent,
    CharactersComponent,
    SkillsComponent,
    ClassesComponent,
    TeamSelectorComponent,
    TeamBuilderComponent
  ],
  standalone: true,
  template: `
        <div class="w-full h-full">
            <as-split>
                <as-split-area [size]="50" [minSize]="50">
                    <div class="flex flex-col h-full">
                        @if (this.activeTeam()) {
                            <app-team-builder [team]="activeTeam()!"/>
                        } @else {
                            <app-team-selector/>
                        }
                    </div>
                </as-split-area>
                @if (isResourcesPanelOpen()) {
                    <as-split-area [size]="50" [maxSize]="50">
                        <div class="h-12">
                            <app-navbar/>
                        </div>
                        <div class="h-[calc(100vh-48px)]">
                            @if (this.getCurrentView() === ViewType.RESOURCES) {
                                <app-resources-menu/>
                            } @else if (this.getCurrentView() === ViewType.CHARACTERS) {
                                <app-characters/>
                            } @else if (this.getCurrentView() === ViewType.EMBLEMS) {
                                <app-emblems/>
                            } @else if (this.getCurrentView() === ViewType.SKILLS) {
                                <app-skills/>
                            } @else if (this.getCurrentView() === ViewType.CLASSES) {
                                <app-classes/>
                            }
                        </div>
                    </as-split-area>
                }
            </as-split>
        </div>
    `
})
export class HomePageComponent {
  protected readonly ViewType: typeof ViewType = ViewType;
  private readonly teamService: TeamService = inject(TeamService);
  readonly activeTeam: Signal<Team | null> = this.teamService.activeTeam;
  private readonly viewStateService: ViewStateService = inject(ViewStateService);
  readonly isResourcesPanelOpen: Signal<boolean> = this.viewStateService.getIsResourcesPanelOpen();

  public getCurrentView(): ViewType {
    return this.viewStateService.getCurrentView()();
  }
}
