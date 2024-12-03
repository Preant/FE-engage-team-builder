import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  Input,
  OnInit,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import { Router } from '@angular/router';

import { LoaderComponent } from '@/app/components/loader/loader.component';
import { Character } from '@/app/models/Character.model';
import { AssetsService } from '@/app/services/assets.service';

@Component({
  selector: 'character-small-card',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  template: `
        <ng-container *ngIf="character">
            <div class="character-card w-[300px] h-[80px] rounded-lg shadow-lg overflow-hidden
                  cursor-pointer transition-all duration-300 ease-in-out transform
                  hover:scale-105 hover:shadow-xl relative
                  bg-gradient-to-br from-prussian_blue-400 to-prussian_blue-600
                  hover:from-prussian_blue-300 hover:to-prussian_blue-500"
                 (click)="navigateToCharacter()">
                <div class="absolute inset-0 bg-gradient-to-br from-prussian_blue-500 to-prussian_blue-700
                    opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100">
                </div>
                <div class="relative w-full h-full flex rounded-lg overflow-hidden">
                    <div class="w-1/3 h-full overflow-hidden relative">
                        @defer (on viewport) {
                            <img [src]="characterImageUrl()"
                                 [alt]="character.name"
                                 class="w-full h-full object-cover object-center transform scale-110 hover:scale-125 transition-transform duration-300 ease-in-out">
                        } @placeholder {
                            <div class="absolute inset-0 flex items-center justify-center bg-prussian_blue-700">
                                <app-loader [size]="40" [thickness]="3"></app-loader>
                            </div>
                        } @error {
                            <div class="w-full h-full flex items-center justify-center bg-prussian_blue-700 text-mauve text-sm">
                                Error loading image
                            </div>
                        }
                    </div>
                    <div class="w-2/3 flex items-center pl-2 pr-1">
                        <h3 class="character-name text-mauve font-bold leading-tight z-20
                       px-2 py-1 bg-rich_black-500 bg-opacity-80 rounded w-full
                       whitespace-nowrap overflow-hidden text-ellipsis"
                            [class.text-long]="isLongName()">
                            {{ character.name }}
                        </h3>
                    </div>
                </div>
            </div>
        </ng-container>
    `,
  styles: [`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap');

        .character-name {
            font-family: 'Cinzel', serif;
            font-size: 35px;
        }

        .character-name.text-long {
            font-size: 25px;
        }

        .character-card {
            background-image: linear-gradient(135deg, theme('colors.prussian_blue.400'), theme('colors.prussian_blue.600'));
        }

        .character-card:hover {
            background-image: linear-gradient(135deg, theme('colors.prussian_blue.300'), theme('colors.prussian_blue.500'));
        }
    `]
})
export class CharacterSmallCardComponent implements OnInit {
  private assetsService: AssetsService = inject(AssetsService);
  characterImageUrl: Signal<string> = computed((): string => {
    return this.assetsService.getCharacterImage(this.character.resourceIdentifier);
  });
  private isLongNameSignal: WritableSignal<boolean> = signal(false);
  isLongName: Signal<boolean> = computed((): boolean => this.isLongNameSignal());

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
  }

  private _character?: Character;

  get character(): Character {
    return this._character!;
  }

    @Input({ required: true })
  set character(value: Character) {
    this._character = value;
    this.checkNameLength();
  }

    ngOnInit(): void {
      this.checkNameLength();
    }

    navigateToCharacter(): void {
      if (this.character) {
        void this.router.navigate(['/characters', this.character.resourceIdentifier]);
      }
    }

    private checkNameLength(): void {
      if (this.character?.name) {
        this.isLongNameSignal.set(this.character.name.length > 6);
      }
    }
}
