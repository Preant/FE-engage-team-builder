import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-video-player',
  standalone: true,
  template: `
        <video
                #videoElement
                [src]="currentVideoUrl"
                class="w-full h-full object-cover"
                [class.hidden]="isWaiting"
                autoplay
                [muted]="true"
                playsinline
                (ended)="onVideoEnded()"
        ></video>
    `
})
export class VideoPlayerComponent implements AfterViewInit {
    @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
    @Input() videos!: string[];
    @Input() waitDurationBetweenVideoCycles: number = 3500;

    currentVideoIndex: number = 0;
    playedVideos: Set<number> = new Set();
    isWaiting: boolean = false;
    currentVideoUrl: string = '';

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngAfterViewInit() {
      this.currentVideoUrl = this.videos[0];
      this.cdr.detectChanges();
    }

    onVideoEnded() {
      this.playedVideos.add(this.currentVideoIndex);

      if (this.playedVideos.size === this.videos.length) {
        this.isWaiting = true;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.playedVideos.clear();
          this.currentVideoIndex = 0;
          this.currentVideoUrl = this.videos[0];
          this.isWaiting = false;
          this.cdr.detectChanges();

          if (this.videoElement) {
            void this.videoElement.nativeElement.play();
          }
        }, this.waitDurationBetweenVideoCycles);
      } else {
        const availableIndices: number[] = this.videos
          .map((_: string, index: number) => index)
          .filter((index: number): boolean => !this.playedVideos.has(index));

        const randomIndex: number = Math.floor(Math.random() * availableIndices.length);
        this.currentVideoIndex = availableIndices[randomIndex];
        this.currentVideoUrl = this.videos[this.currentVideoIndex];
      }
    }
}
