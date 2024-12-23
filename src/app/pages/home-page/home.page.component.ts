import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { SplitAreaComponent, SplitComponent } from 'angular-split';

import { CharactersComponent } from '@/app/components/resources/characters.component';
import { ClassesComponent } from '@/app/components/resources/classes.component';
import { EmblemsComponent } from '@/app/components/resources/emblems.component';
import { SkillsComponent } from '@/app/components/resources/skills.component';
import { WeaponsComponent } from '@/app/components/resources/weapons.component';
import { ResourcesMenuComponent } from '@/app/components/resources-menu.component';
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
    TeamBuilderComponent,
    WeaponsComponent
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
                            } @else if (this.getCurrentView() === ViewType.WEAPONS) {
                                <app-weapons/>
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
