import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SplitAreaComponent, SplitComponent } from 'angular-split';

import { CharactersComponent } from '@/app/components/characters.component';
import { EmblemsComponent } from '@/app/components/emblems.component';
import { ResourcesMenuComponent } from '@/app/components/resources-menu.component';
import { SkillsComponent } from '@/app/components/skills.component';
import { TeamBuilderComponent } from '@/app/components/team-builder/teambuilder.component';
import { NavbarComponent } from '@/app/header/navbar.component';
import { ViewType } from '@/app/models/ViewType.enum';
import { ViewStateService } from '@/app/services/view-state.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ResourcesMenuComponent,
    SplitComponent,
    SplitAreaComponent,
    NavbarComponent,
    EmblemsComponent,
    CharactersComponent,
    TeamBuilderComponent,
    SkillsComponent
  ],
  template: `
        <div class="w-full h-full">
            <as-split>
                <as-split-area [size]="50" [minSize]="50">
                    <app-team-builder/>
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
  protected readonly ViewType = ViewType;
}
