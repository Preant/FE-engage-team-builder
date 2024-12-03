import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

import { CHARACTER_DATA_PATH } from '@/app/config/config';
import { Character } from '@/app/models/Character.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private charactersDataPath: string = CHARACTER_DATA_PATH;
  private characters: WritableSignal<Character[]> = signal<Character[]>([]);

  constructor(private http: HttpClient) {
    this.loadCharactersInformation();
  }

  public getCharacters(): Signal<Character[]> {
    return this.characters.asReadonly();
  }

  public getCharacterByName(name: string): Character | undefined {
    return this.characters().find((character: Character): boolean => character.resourceIdentifier === name);
  }

  private loadCharactersInformation(): void {
    this.http.get<Character[]>(this.charactersDataPath).subscribe({
      next: (characters: Character[]): void => {
        this.characters.set(characters);
      },
      error: (error: any): void => {
        console.error('Error fetching characters:', error);
      }
    });
  }
}
