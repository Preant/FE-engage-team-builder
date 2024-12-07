import { APP_INITIALIZER } from '@angular/core';

import { CharacterService, EmblemService, WeaponService } from '@/app/services/resources.service';

export function initializeWeapons(weaponService: WeaponService) {
  return () => weaponService.loadResourcesInformation();
}

export function initializeCharacters(characterService: CharacterService) {
  return () => characterService.loadResourcesInformation();
}

export function initializeEmblems(emblemService: EmblemService) {
  return () => emblemService.loadResourcesInformation();
}

export const appInitializer = [
  { provide: APP_INITIALIZER, useFactory: initializeWeapons, deps: [WeaponService], multi: true },
  { provide: APP_INITIALIZER, useFactory: initializeCharacters, deps: [CharacterService], multi: true },
  { provide: APP_INITIALIZER, useFactory: initializeEmblems, deps: [EmblemService], multi: true }
];
