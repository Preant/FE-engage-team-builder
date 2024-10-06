import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Character } from "../models/Character.model";
import { CommonModule } from '@angular/common';
import { CHARACTER_RESOURCE_PATH } from "../config/config";
import { Router } from "@angular/router";

@Component({
    selector: 'character-small-card',
    standalone: true,
    imports: [CommonModule],
    template: `
        <ng-container *ngIf="character">
            <div class="character-card w-[300px] h-[80px] rounded-lg shadow-lg overflow-hidden
                        cursor-pointer transition-all duration-300 ease-in-out transform 
                        hover:scale-105 hover:shadow-xl relative
                        bg-gradient-to-br from-prussian_blue-400 to-prussian_blue-600
                        hover:from-prussian_blue-300 hover:to-prussian_blue-500"
                 (click)="navigateToCharacter()">
                <div class="absolute inset-0 bg-gradient-to-br from-prussian_blue-500 to-prussian_blue-700 
                            opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"></div>
                <div class="relative w-full h-full flex rounded-lg overflow-hidden">
                    <div class="w-1/3 h-full overflow-hidden">
                        <img [src]="CHARACTER_RESOURCE_PATH + character.resourceIdentifier + '/' + character.resourceIdentifier + '_portrait.png'"
                             [alt]="character.name"
                             class="w-full h-full object-cover object-center transform scale-110 hover:scale-125 transition-transform duration-300 ease-in-out">
                    </div>
                    <div class="w-2/3 flex items-center pl-2 pr-1">
                        <h3 class="character-name text-mauve font-bold leading-tight z-20 
                                   px-2 py-1 bg-rich_black-500 bg-opacity-80 rounded w-full 
                                   whitespace-nowrap overflow-hidden text-ellipsis"
                            [class.text-long]="isLongName">
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
    @Input() character?: Character;
    isLongName: boolean = false;
    protected readonly CHARACTER_RESOURCE_PATH = CHARACTER_RESOURCE_PATH;

    constructor(private router: Router, private cdr: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.checkNameLength();
    }

    checkNameLength() {
        if (this.character && this.character.name) {
            this.isLongName = this.character.name.length > 6;
            this.cdr.detectChanges();
        }
    }

    navigateToCharacter() {
        if (this.character) {
            this.router.navigate(['/characters', this.character.resourceIdentifier]);
        }
    }
}
