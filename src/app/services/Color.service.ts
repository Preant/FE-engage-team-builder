import { Injectable } from '@angular/core';

import { Character } from '@/app/models/Character.model';
import { Country } from '@/app/models/Country.enum';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private readonly countryColors: Record<Country, string> = {
    [Country.LYTHOS]: '#ffd700',    // Gold
    [Country.FIRENE]: '#4caf50',    // Green
    [Country.BRODIA]: '#8b0000',    // Dark Red
    [Country.ELUSIA]: '#4a90e2',    // Blue
    [Country.SOLM]: '#ff4500',      // Orange-Red
    [Country.GRADLON]: '#9c27b0'    // Purple
  };

  public getColorForCharacter(character: Character): string {
    return this.countryColors[character.country];
  }
}
