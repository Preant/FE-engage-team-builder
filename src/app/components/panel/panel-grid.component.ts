// panel-grid.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

import { PanelButtonComponent } from '@/app/components/panel/panel-button.component';
import { VideoPlayerComponent } from '@/app/components/video-player/video-player.component';
import { PanelGridConfig } from '@/app/models/PanelGridConfig.model';

@Component({
  selector: 'app-panel-grid',
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
                @if (customTemplate) {
                    <ng-container *ngTemplateOutlet="customTemplate; context: { items: items }">
                    </ng-container>
                } @else {
                    @for (item of items; track trackBy(item)) {
                        <div [class]="item.gridArea || ''">
                            @if (isPanelButton(item)) {
                                <app-panel-button [button]="item">
                                    @if (item.isVideo) {
                                        <app-video-player
                                                video-content
                                                [videos]="item.content"
                                                [waitDurationBetweenVideoCycles]="config.waitDurationBetweenVideoCycles"
                                        ></app-video-player>
                                    }
                                </app-panel-button>
                            } @else {
                                <ng-container
                                        *ngTemplateOutlet="defaultItemTemplate || null; context: { $implicit: item }">
                                </ng-container>
                            }
                        </div>
                    }
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
export class PanelGridComponent {
    @Input() config!: PanelGridConfig;

    @Input() items: any[] = [];
    @Input() customTemplate: TemplateRef<any> | null = null;
    @Input() defaultItemTemplate: TemplateRef<any> | null = null;

    get gridTemplateColumns(): string {
      return `repeat(${this.config.cols}, minmax(0, 1fr))`;
    }

    get gridTemplateRows(): string {
      return `repeat(${this.config.rows}, minmax(0, 1fr))`;
    }

    @Input() trackByFn: (index: number, item: any) => any = (index: number): number => index;

    trackBy(item: any): any {
      return this.trackByFn(this.items.indexOf(item), item);
    }

    isPanelButton(item: any): boolean {
      return item.hasOwnProperty('isVideo') && item.hasOwnProperty('content');
    }
}
