import { Injectable } from '@angular/core';

import { CHARACTER_RESOURCE_PATH, EMBLEM_RESOURCE_PATH, WEAPON_RESOURCE_PATH } from '@/app/config/config';
import { ImageSize } from '@/app/models/ImageSize.enum';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor() {
  }

  getCharacterImage(characterIdentifier: string, size: ImageSize = ImageSize.SMALL): string {
    if (size === ImageSize.SMALL) {
      return `${CHARACTER_RESOURCE_PATH}${characterIdentifier}/${characterIdentifier}_body_small.png`;
    }
    return `${CHARACTER_RESOURCE_PATH}${characterIdentifier}/${characterIdentifier}_body.png`;
  }

  getEmblemImage(emblemIdentifier: string, size: ImageSize = ImageSize.SMALL): string {
    if (size === ImageSize.SMALL) {
      return `${EMBLEM_RESOURCE_PATH}${emblemIdentifier}_small.png`;
    }
    return `${EMBLEM_RESOURCE_PATH}${emblemIdentifier}.png`;
  }

  getWeaponImage(weaponIdentifier: string, _size: ImageSize = ImageSize.SMALL): string {
    return `${WEAPON_RESOURCE_PATH}${weaponIdentifier}.png`;
  }
}
