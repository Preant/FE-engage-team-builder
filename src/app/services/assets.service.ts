import { Injectable } from '@angular/core';

import { CHARACTER_RESOURCE_PATH, EMBLEM_RESOURCE_PATH, WEAPON_RESOURCE_PATH } from '@/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor() {
  }

  getCharacterImage(characterIdentifier: string): string {
    return `${CHARACTER_RESOURCE_PATH}${characterIdentifier}/${characterIdentifier}_portrait.png`;
  }

  getEmblemImage(emblemIdentifier: string): string {
    return `${EMBLEM_RESOURCE_PATH}${emblemIdentifier}/${emblemIdentifier}_body.png`;
  }

  getWeaponImage(weaponIdentifier: string): string {
    return `${WEAPON_RESOURCE_PATH}${weaponIdentifier}.png`;
  }
}
