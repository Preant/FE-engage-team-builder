// panel-grid.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

import { PanelButtonComponent } from '@/app/components/panel/panel-button.component';
import { VideoPlayerComponent } from '@/app/components/video-player/video-player.component';
import { CharactersPanelGridConfig } from '@/app/models/CharactersPanelGridConfig.model';

@Component({
  selector: 'characters-panel-grid',
  standalone: true,
  imports: [CommonModule, PanelButtonComponent, VideoPlayerComponent],
  template: `
        <div class="w-full h-full bg-prussian_blue-100/5 rounded-xl shadow-2xl overflow-hidden p-4">
            <div
                    class="grid gap-4 h-full"
                    [ngStyle]="{
          'grid-template-columns': gridTemplateColumns,
          'grid-template-rows': gridTemplateRows
        }"
            >
                @for (item of items; track trackBy(item)) {
                    <div [class]="item.gridArea || ''">
                        <ng-container
                                *ngTemplateOutlet="customTemplate; context: { $implicit: item }">
                        </ng-container>
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
    @Input() config!: CharactersPanelGridConfig;

    @Input() items: any[] = [];
    @Input() customTemplate!: TemplateRef<any>;

    get gridTemplateColumns(): string {
      return `repeat(${this.config.cols}, minmax(0, 1fr))`;
    }

    get gridTemplateRows(): string {
      return `repeat(${this.config.rows}, minmax(0, 1fr))`;
    }

    @Input() trackByFn: (item: any) => any = (index: number): number => index;

    trackBy(item: any): any {
      return this.trackByFn(item);
    }
}
