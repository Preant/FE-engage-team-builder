import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { CHARACTER_DATA_PATH } from '@/app/config/config';
import { Character } from '@/app/models/Character.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private charactersDataPath: string = CHARACTER_DATA_PATH;
  private characters: WritableSignal<Character[]> = signal<Character[]>([]);

  constructor(private http: HttpClient) {
  }

  public getCharacters(): Signal<Character[]> {
    return this.characters.asReadonly();
  }

  public getCharacterByIdentifier(identifier: string): Character | undefined {
    return this.characters().find((character: Character): boolean => character.identifier === identifier);
  }

  public async loadCharactersInformation(): Promise<void> {
    try {
      const characters: Character[] = await firstValueFrom(
        this.http.get<Character[]>(this.charactersDataPath)
      );
      this.characters.set(characters);
    } catch (error) {
      console.error('Error fetching characters:', error);
      throw error;
    }
  }
}
