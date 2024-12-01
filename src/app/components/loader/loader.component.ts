import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
        <div class="flex justify-center items-center" [style.height]="size + 'px'" [style.width]="size + 'px'">
            <div class="relative">
                <div class="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 animate-spin"
                     [ngStyle]="{
               'height': size + 'px',
               'width': size + 'px'
             }">
                </div>
                <div class="absolute rounded-full bg-white dark:bg-gray-900"
                     [ngStyle]="{
               'height': (size - thickness * 2) + 'px',
               'width': (size - thickness * 2) + 'px',
               'margin': thickness + 'px'
             }">
                </div>
                <div class="absolute rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"
                     [ngStyle]="{
               'height': size + 'px',
               'width': size + 'px'
             }">
                </div>
            </div>
        </div>
    `,
  styles: [`
        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 0.3;
            }
            50% {
                opacity: 0.1;
            }
        }

        .animate-spin {
            animation: spin 1.5s linear infinite;
        }

        .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
    `]
})
export class LoaderComponent {
    @Input() size: number = 60;
    @Input() thickness: number = 4;
}
