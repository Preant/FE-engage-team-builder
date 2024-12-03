import { APP_INITIALIZER } from '@angular/core';

import { CharacterService } from '@/app/services/character.service';
import { EmblemService } from '@/app/services/emblem.service';
import { WeaponService } from '@/app/services/weapon.service';


export function initializeWeapons(weaponService: WeaponService) {
  return () => weaponService.loadWeaponsInformation();
}

export function initializeCharacters(characterService: CharacterService) {
  return () => characterService.loadCharactersInformation();
}

export function initializeEmblems(emblemService: EmblemService) {
  return () => emblemService.loadEmblemsInformation();
}

export const appInitializer = [
  { provide: APP_INITIALIZER, useFactory: initializeWeapons, deps: [WeaponService], multi: true },
  { provide: APP_INITIALIZER, useFactory: initializeCharacters, deps: [CharacterService], multi: true },
  { provide: APP_INITIALIZER, useFactory: initializeEmblems, deps: [EmblemService], multi: true }
];
