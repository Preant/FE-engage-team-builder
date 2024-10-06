import { Injectable } from '@angular/core';
import { CHARACTER_DATA_PATH } from "../config/config";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Character } from "../models/Character.model";

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
                next: (characters: Character[]) => {
                    this.charactersSubject.next(characters);
                },
                error: (error) => {
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
            map((characters: Character[]) => characters.find((character: Character) => character.resourceIdentifier === name))
        );
    }
}
