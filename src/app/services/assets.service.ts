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

  getEmblemImage(identifier: string, secondaryIdentifier: string | undefined, size: ImageSize = ImageSize.SMALL): string {
    const effectiveIdentifier: string = secondaryIdentifier || identifier;
    if (size === ImageSize.SMALL) {
      return `${EMBLEM_RESOURCE_PATH}${identifier}/${effectiveIdentifier}_body_small.png`;
    }
    return `${EMBLEM_RESOURCE_PATH}${identifier}/${effectiveIdentifier}_body.png`;
  }

  getWeaponImage(weaponIdentifier: string, _size: ImageSize = ImageSize.SMALL): string {
    return `${WEAPON_RESOURCE_PATH}${weaponIdentifier}.png`;
  }
}
