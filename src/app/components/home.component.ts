import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Character } from "../models/Character.model";
import { CharacterService } from "../services/character.service";
import { CharacterDetailComponent } from "./character-detail.component";
import { NgForOf } from "@angular/common";

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CharacterDetailComponent,
        NgForOf
    ],
    template: `
        <div class="bg-rich_black-400 min-h-screen p-4">
            <div class="overflow-x-auto" #scrollContainer>
                <div class="flex space-x-4 pb-4">
                    <character-detail
                            *ngFor="let character of characters"
                            [character]="character"
                            class="flex-shrink-0"
                    ></character-detail>
                </div>
            </div>
        </div>
    `,
    styles: `
        .overflow-x-auto {
            scrollbar-width: thin;
            scrollbar-color: #248232 #04471c;
        }

        .overflow-x-auto::-webkit-scrollbar {
            height: 8px;
        }

        .overflow-x-auto::-webkit-scrollbar-track {
            background: #04471c;
        }

        .overflow-x-auto::-webkit-scrollbar-thumb {
            background-color: #248232;
            border-radius: 4px;
        }`
})
export class HomeComponent implements OnInit, AfterViewInit {
    @ViewChild('scrollContainer') scrollContainer!: ElementRef;

    public characters: Character[] = [];

    constructor(private characterService: CharacterService) {
    }

    ngOnInit() {
        this.characterService.getCharacters().subscribe((characters: Character[]) => {
            this.characters = characters;
        });
    }

    ngAfterViewInit() {
        this.setupMouseWheelScroll();
    }

    private setupMouseWheelScroll() {
        const scrollContainer = this.scrollContainer.nativeElement;

        scrollContainer.addEventListener('wheel', (event: WheelEvent) => {
            event.preventDefault();

            scrollContainer.scrollLeft += event.deltaY;
        });
    }
}
