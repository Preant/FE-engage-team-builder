import { Injectable } from '@angular/core';

import { Character } from '@/app/models/Character.model';
import { Class } from '@/app/models/Class.model';
import { ClassType } from '@/app/models/ClassType.enum';
import { Country } from '@/app/models/Country.enum';
import { Weapon } from '@/app/models/Weapon.model';
import { WeaponType } from '@/app/models/WeaponType.enum';

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

  private readonly classTypeColors: Record<ClassType, string> = {
    [ClassType.DRAGON]: '#ff0000',     // Red
    [ClassType.FLYING]: '#87CEEB',      // Light Blue
    [ClassType.BACKUP]: '#FFFF00',      // Yellow
    [ClassType.CAVALRY]: '#90EE90',     // Light Green
    [ClassType.ARMOR]: '#00008B',       // Deep Sea Blue
    [ClassType.MYSTICAL]: '#800080',    // Purple
    [ClassType.QI_ADEPT]: '#FFC0CB',    // Pink
    [ClassType.COVERT]: '#A9A9A9'       // Dark Gray
  };

  private readonly weaponTypeColors: Record<WeaponType, string> = {
    [WeaponType.SWORD]: '#0000ff',      // Blue
    [WeaponType.LANCE]: '#008000',      // Green
    [WeaponType.AXE]: '#800000',        // Red
    [WeaponType.BOW]: '#ffa500',        // Orange
    [WeaponType.DAGGER]: '#800080',     // Purple
    [WeaponType.TOME]: '#ff0000',       // Red
    [WeaponType.STAFF]: '#ffff00',      // Yellow
    [WeaponType.BLAST]: '#a52a2a',      // Brown
    [WeaponType.ART]: '#FFC0CB',        // Pink
    [WeaponType.DRAGONSTONE]: '#ff0000' // Red
  };

  private readonly uniqueWeaponColor: string = '#ff00ff'; // Magenta

  public getColorForCharacter(character: Character): string {
    return this.countryColors[character.country];
  }

  public getColorForClassType(combatClass: Class): string {
    return this.classTypeColors[combatClass.type];
  }

  public getColorForWeapon(weapon: Weapon): string {
    return weapon.isUnique ? this.uniqueWeaponColor : this.weaponTypeColors[weapon.weaponType];
  }
}
