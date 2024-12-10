import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ResourcesPanelGridComponent } from '@/app/components/panel/resources-panel-grid.component';
import { PanelButton } from '@/app/models/PanelButton.model';
import { ViewType } from '@/app/models/ViewType.enum';

@Component({
  selector: 'app-resources-menu',
  imports: [CommonModule, ResourcesPanelGridComponent],
  standalone: true,
  template: `
        <div
                class="w-full h-full bg-gradient-to-br from-rich_black-500 to-prussian_blue-500 flex items-center justify-center">
            <resources-panel-grid
                    class="h-full"
                    [waitDurationBetweenVideoCycles]="3500"
                    [buttons]="buttons"
            />
        </div>
    `
})
export class ResourcesMenuComponent {
  public buttons: PanelButton[] = [
    {
      name: 'Characters',
      viewType: ViewType.CHARACTERS,
      size: 'large',
      color: 'rich_black',
      gridArea: 'col-span-5 row-span-4',
      textGradient: 'from-red-500 via-purple-500 to-blue-500',
      content: ['/assets/videos/engage_opening.mp4'],
      isVideo: true
    },
    {
      name: 'Classes',
      viewType: ViewType.CLASSES,
      size: 'small',
      color: '',
      gridArea: 'col-span-2 row-span-2',
      textGradient: 'from-blue-400 via-green-500 to-yellow-500',
      content: ['/assets/images/classes.png'],
      isVideo: false
    },
    {
      name: 'Emblems',
      viewType: ViewType.EMBLEMS,
      size: 'large',
      color: 'paynes_gray',
      gridArea: 'col-span-2 row-span-4',
      textGradient: 'from-green-400 via-blue-500 to-purple-600',
      content: ['/assets/videos/celica_intro.mp4', '/assets/videos/leif_intro.mp4', '/assets/videos/micaiah_intro.mp4', '/assets/videos/roy_intro.mp4'],
      isVideo: true
    },
    {
      name: 'Weapons',
      viewType: ViewType.WEAPONS,
      size: 'small',
      color: 'prussian_blue',
      gridArea: 'col-span-1 row-span-1',
      textGradient: 'from-purple-400 via-pink-500 to-red-500',
      content: ['/assets/images/weapons.png'],
      isVideo: false
    },
    {
      name: 'Staves',
      viewType: ViewType.STAVES,
      size: 'small',
      color: 'gunmetal',
      gridArea: 'col-span-1 row-span-1',
      textGradient: 'from-blue-400 via-green-500 to-yellow-500',
      content: ['/assets/images/staves.png'],
      isVideo: false
    },
    {
      name: 'Skills',
      viewType: ViewType.SKILLS,
      size: 'small',
      color: 'air_superiority_blue',
      gridArea: 'col-span-2 row-span-2',
      textGradient: 'from-yellow-400 via-red-500 to-pink-500',
      content: ['/assets/images/skills.png'],
      isVideo: false
    },
    {
      name: 'Forging',
      viewType: ViewType.FORGING,
      size: 'small',
      color: 'mauve',
      gridArea: 'col-span-1 row-span-2',
      textGradient: 'from-indigo-400 via-purple-500 to-pink-500',
      content: ['/assets/images/forging.png'],
      isVideo: false
    }
  ];
}
