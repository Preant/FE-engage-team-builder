import { CommonModule } from '@angular/common';
import { Component, computed, Input, Signal, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PanelButton } from '@/app/models/PanelButton.model';

@Component({
  selector: 'app-panel-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
        <div
                [ngClass]="classes()"
                (mouseenter)="onMouseEnter()"
                (mouseleave)="onMouseLeave()"
                [routerLink]="button.link"
                class="transition-all h-full w-full duration-300 ease-in-out flex items-end justify-center rounded-lg shadow-lg cursor-pointer overflow-hidden relative p-4"
        >
            <div class="absolute inset-0 w-full h-full overflow-hidden">
                @if (button.isVideo) {
                    <ng-content select="[video-content]"></ng-content>
                } @else {
                    <img
                            [src]="button.content[0]"
                            class="w-full h-full object-cover"
                            [alt]="button.name"
                    >
                }
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
            <span
                    [ngClass]="textClasses()"
                    class="relative z-10 text-center px-2 gradient-text"
            >
        {{ button.name }}
      </span>
        </div>
    `,
  styles: [`
        .gradient-text {
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            font-family: 'Cinzel', serif;
            font-weight: 700;
            letter-spacing: 1px;
        }
    `]
})
export class PanelButtonComponent {
    @Input() button!: PanelButton;
    protected textClasses: Signal<string> = computed((): string => `
    ${this.button.size === 'large' ? 'text-4xl sm:text-5xl md:text-6xl' : 'text-xl sm:text-2xl md:text-3xl'}
    bg-gradient-to-r ${this.button.textGradient}
  `);
    private isHovered: WritableSignal<boolean> = signal<boolean>(false);
    protected classes: Signal<string> = computed((): string => `
    ${this.button.gridArea}
    ${this.isHovered() ? `scale-[1.02]` : 'scale-100'}
    bg-gradient-to-br from-${this.button.color}-400 to-${this.button.color}-600
  `);

    onMouseEnter(): void {
      this.isHovered.set(true);
    }

    onMouseLeave(): void {
      this.isHovered.set(false);
    }
}
