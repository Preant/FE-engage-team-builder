import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";
import { PanelButton } from "../models/front/PanelButton.models";


@Component({
    selector: 'app-databank-homepage',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
        <div class="w-full h-screen bg-gradient-to-br from-rich_black-500 to-prussian_blue-500 p-4 flex items-center justify-center">
            <div class="w-full h-full max-w-7xl max-h-[90vh] bg-prussian_blue-100 rounded-xl shadow-2xl overflow-hidden grid grid-cols-5 grid-rows-8 gap-4 p-4 relative">
                <ng-container *ngFor="let button of buttons; let i = index">
                    <div
                            [ngClass]="buttonClasses(button)"
                            (mouseenter)="hoveredButton = button.name"
                            (mouseleave)="hoveredButton = null"
                            [routerLink]="button.link"
                    >
                        <div class="absolute inset-0 w-full h-full overflow-hidden">
                            <ng-container *ngIf="button.isVideo; else imageContent">
                                <video
                                        #videoElement
                                        [attr.data-index]="i"
                                        [src]="button.content[0]"
                                        class="w-full h-full object-cover"
                                        [class.hidden]="isWaiting[i]"
                                        autoplay
                                        [muted]="isMuted"
                                        playsinline
                                        (ended)="onVideoEnded($event, i)"
                                ></video>
                            </ng-container>
                            <ng-template #imageContent>
                                <img [src]="button.content[0]" class="w-full h-full object-cover"
                                     alt="{{ button.name }}">
                            </ng-template>
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                        <span [ngClass]="textClasses(button)"
                              class="relative z-10 text-center px-2">{{ button.name }}</span>
                    </div>
                </ng-container>
            </div>
        </div>
    `,
    styles: [`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');

        .gradient-text {
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            font-family: 'Cinzel', serif;
            font-weight: 700;
            letter-spacing: 1px;
        }

        .fade-out {
            opacity: 0;
            transition: opacity 1s ease-out;
        }

        .fade-in {
            opacity: 1;
            transition: opacity 1s ease-in;
        }
    `]
})
export class ResourcesComponent implements AfterViewInit {
    @ViewChildren('videoElement') videoElements!: QueryList<ElementRef>;

    hoveredButton: string | null = null;
    isMuted: boolean = true;
    currentVideoIndices: number[] = [];
    playedVideos: Set<number>[] = [];
    waitDuration: number = 3500; // 3.5 seconds wait between cycles
    isWaiting: boolean[] = [];

    buttons: PanelButton[] = [
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

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngAfterViewInit() {
        this.currentVideoIndices = new Array(this.buttons.length).fill(0);
        this.playedVideos = this.buttons.map(() => new Set<number>());
        this.isWaiting = new Array(this.buttons.length).fill(false);
        this.cdr.detectChanges();
    }

    buttonClasses(button: PanelButton): string {
        return `
      ${button.gridArea}
      ${this.hoveredButton === button.name ? 'scale-[1.02]' : 'scale-100'}
      transition-all duration-300 ease-in-out
      flex items-end justify-center
      rounded-lg shadow-lg
      bg-gradient-to-br from-${button.color}-400 to-${button.color}-600
      cursor-pointer
      overflow-hidden
      relative
      p-4
    `;
    }

    textClasses(button: PanelButton): string {
        return `
      gradient-text ${button.size === 'large' ? 'text-4xl sm:text-5xl md:text-6xl' : 'text-xl sm:text-2xl md:text-3xl'}
      bg-gradient-to-r ${button.textGradient}
    `;
    }

    onVideoEnded(event: Event, buttonIndex: number) {
        const videoElement = event.target as HTMLVideoElement;
        const button = this.buttons[buttonIndex];
        if (button.isVideo) {
            this.playedVideos[buttonIndex].add(this.currentVideoIndices[buttonIndex]);

            if (this.playedVideos[buttonIndex].size === button.content.length) {
                // All videos have been played, wait before restarting the cycle
                this.isWaiting[buttonIndex] = true;
                this.cdr.detectChanges();
                setTimeout(() => {
                    this.playedVideos[buttonIndex].clear();
                    this.currentVideoIndices[buttonIndex] = 0;
                    videoElement.src = button.content[0];
                    videoElement.load();
                    this.isWaiting[buttonIndex] = false;
                    this.cdr.detectChanges();
                    videoElement.play();
                }, this.waitDuration);
            } else {
                // Play the next video immediately
                let availableIndices = button.content.map((_, index) => index)
                    .filter(index => !this.playedVideos[buttonIndex].has(index));

                const randomIndex = Math.floor(Math.random() * availableIndices.length);
                this.currentVideoIndices[buttonIndex] = availableIndices[randomIndex];

                videoElement.src = button.content[this.currentVideoIndices[buttonIndex]];
                videoElement.load();
                videoElement.play();
            }
        }
    }
}
