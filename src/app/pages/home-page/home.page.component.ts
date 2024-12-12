import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { SplitAreaComponent, SplitComponent } from 'angular-split';

import { CharactersComponent } from '@/app/components/characters.component';
import { EmblemsComponent } from '@/app/components/emblems.component';
import { ResourcesMenuComponent } from '@/app/components/resources-menu.component';
import { SkillsComponent } from '@/app/components/skills.component';
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
    TeamBuilderComponent
  ],
  standalone: true,
  template: `
        <div class="w-full h-full">
            <as-split>
                <as-split-area [size]="50" [minSize]="50">
                    <app-team-builder [team]="team()"/>
                </as-split-area>
                <as-split-area [size]="50" [maxSize]="50">
                    <div class="h-12">
                        <app-navbar/>
                    </div>
                    <div class="h-[calc(100vh-48px)]">
                        @if (viewStateService.getCurrentView()() === ViewType.RESOURCES) {
                            <app-resources-menu/>
                        } @else if (viewStateService.getCurrentView()() === ViewType.CHARACTERS) {
                            <app-characters/>
                        } @else if (viewStateService.getCurrentView()() === ViewType.EMBLEMS) {
                            <app-emblems/>
                        } @else if (viewStateService.getCurrentView()() === ViewType.SKILLS) {
                            <app-skills/>
                        }
                    </div>
                </as-split-area>
            </as-split>
        </div>
    `
})
export class HomePageComponent {
  viewStateService: ViewStateService = inject(ViewStateService);
  protected readonly ViewType: typeof ViewType = ViewType;
  private teamService: TeamService = inject(TeamService);
  public team: Signal<Team> = this.teamService.team;
}
