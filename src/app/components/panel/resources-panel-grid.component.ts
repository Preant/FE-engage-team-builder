import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { PanelButtonComponent } from '@/app/components/panel/panel-button.component';
import { VideoPlayerComponent } from '@/app/components/video-player/video-player.component';
import { PanelButton } from '@/app/models/PanelButton.model';

@Component({
  selector: 'resources-panel-grid',
  standalone: true,
  imports: [CommonModule, PanelButtonComponent, VideoPlayerComponent],
  template: `
        <div class="w-full h-full bg-prussian_blue-100/5 rounded-xl shadow-2xl overflow-hidden p-4">
            <div
                    class="grid gap-4 h-full grid-cols-5 grid-rows-8"
            >
                @for (button of buttons; track $index) {
                    <div [class]="button.gridArea">
                        <app-panel-button
                                [button]="button"
                        >
                            @if (button.isVideo) {
                                <app-video-player
                                        video-content
                                        [videos]="button.content"
                                        [waitDurationBetweenVideoCycles]="waitDurationBetweenVideoCycles"
                                ></app-video-player>
                            }
                        </app-panel-button>
                    </div>
                }
            </div>
        </div>
    `,
  styles: [`
        :host {
            display: block;
            height: 100%;
        }
    `]
})
export class ResourcesPanelGridComponent {
    @Input() waitDurationBetweenVideoCycles!: number;
    @Input() buttons: PanelButton[] = [];
}
