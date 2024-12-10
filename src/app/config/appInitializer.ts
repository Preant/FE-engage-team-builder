import { inject, provideAppInitializer } from '@angular/core';

import {
  CharacterService,
  EmblemService,
  ItemService,
  SkillService,
  WeaponService
} from '@/app/services/resources.service';

export function initializeWeapons(weaponService: WeaponService) {
  return () => weaponService.loadResourcesInformation();
}

export function initializeCharacters(characterService: CharacterService) {
  return () => characterService.loadResourcesInformation();
}

export function initializeEmblems(emblemService: EmblemService) {
  return () => emblemService.loadResourcesInformation();
}

export function initializeSkills(skillService: SkillService) {
  return () => skillService.loadResourcesInformation();
}

export function initializeItems(itemService: ItemService) {
  return () => itemService.loadResourcesInformation();
}

export const appInitializer = [
  provideAppInitializer(() => {
        const initializerFn = (initializeWeapons)(inject(WeaponService));
        return initializerFn();
      }),
  provideAppInitializer(() => {
        const initializerFn = (initializeCharacters)(inject(CharacterService));
        return initializerFn();
      }),
  provideAppInitializer(() => {
        const initializerFn = (initializeEmblems)(inject(EmblemService));
        return initializerFn();
      }),
  provideAppInitializer(() => {
        const initializerFn = (initializeSkills)(inject(SkillService));
        return initializerFn();
      }),
  provideAppInitializer(() => {
        const initializerFn = (initializeItems)(inject(ItemService));
        return initializerFn();
      })
];
