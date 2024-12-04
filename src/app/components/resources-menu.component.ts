import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PanelButtonComponent } from '@/app/components/panel/panel-button.component';
import { ResourcesPanelGridComponent } from '@/app/components/panel/resources-panel-grid.component';
import { VideoPlayerComponent } from '@/app/components/video-player/video-player.component';
import { PanelButton } from '@/app/models/PanelButton.model';

@Component({
  selector: 'app-resources-menu',
  standalone: true,
  imports: [CommonModule, ResourcesPanelGridComponent, PanelButtonComponent, VideoPlayerComponent],
  template: `
        <div class="w-full h-full bg-gradient-to-br from-rich_black-500 to-prussian_blue-500 flex items-center justify-center">
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
      link: '/characters',
      size: 'large',
      color: 'rich_black',
      gridArea: 'col-span-3 row-span-4',
      textGradient: 'from-red-500 via-purple-500 to-blue-500',
      content: ['/assets/videos/engage_opening.mp4'],
      isVideo: true
    },
    {
      name: 'Classes',
      link: '/classes',
      size: 'small',
      color: '',
      gridArea: 'col-span-2 row-span-2',
      textGradient: 'from-blue-400 via-green-500 to-yellow-500',
      content: ['/assets/images/classes.png'],
      isVideo: false
    },
    {
      name: 'Emblems',
      link: '/emblems',
      size: 'large',
      color: 'paynes_gray',
      gridArea: 'col-span-2 row-span-6',
      textGradient: 'from-green-400 via-blue-500 to-purple-600',
      content: ['/assets/videos/celica_intro.mp4', '/assets/videos/leif_intro.mp4', '/assets/videos/micaiah_intro.mp4', '/assets/videos/roy_intro.mp4'],
      isVideo: true
    },
    {
      name: 'Skills',
      link: '/skills',
      size: 'small',
      color: 'air_superiority_blue',
      gridArea: 'col-span-2 row-span-2',
      textGradient: 'from-yellow-400 via-red-500 to-pink-500',
      content: ['/assets/images/skills.png'],
      isVideo: false
    },
    {
      name: 'Forging',
      link: '/forging',
      size: 'small',
      color: 'mauve',
      gridArea: 'col-span-1 row-span-4',
      textGradient: 'from-indigo-400 via-purple-500 to-pink-500',
      content: ['/assets/images/forging.png'],
      isVideo: false
    },
    {
      name: 'Weapons',
      link: '/weapons',
      size: 'small',
      color: 'prussian_blue',
      gridArea: 'col-span-2 row-span-2',
      textGradient: 'from-purple-400 via-pink-500 to-red-500',
      content: ['/assets/images/weapons.png'],
      isVideo: false
    }
  ];
}
