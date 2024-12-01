import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { CHARACTER_DATA_PATH } from '@/app/config/config';
import { Character } from '@/app/models/Character.model';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private charactersDataPath: string = CHARACTER_DATA_PATH;
  private charactersSubject: BehaviorSubject<Character[]> = new BehaviorSubject<Character[]>([]);

  constructor(private http: HttpClient) {
    this.loadCharactersInformation();
  }

  public loadCharactersInformation(): void {
    this.http.get<Character[]>(this.charactersDataPath).subscribe({
      next: (characters: Character[]): void => {
        this.charactersSubject.next(characters);
      },
      error: (error: any): void => {
        console.error('Error fetching characters:', error);
        this.charactersSubject.error(error);
      }
    }
    );
  }

  public getCharacters(): Observable<Character[]> {
    return this.charactersSubject.asObservable();
  }

  public getCharacterByName(name: string): Observable<Character | undefined> {
    return this.getCharacters().pipe(
      map((characters: Character[]): Character | undefined => characters.find((character: Character): boolean => character.resourceIdentifier === name))
    );
  }
}
