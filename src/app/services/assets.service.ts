import { Injectable } from '@angular/core';

import {
  CHARACTER_RESOURCE_PATH,
  EMBLEM_RESOURCE_PATH,
  ITEM_RESOURCE_PATH,
  MISCELLANEOUS_RESOURCE_PATH,
  SKILL_RESOURCE_PATH,
  WEAPON_RESOURCE_PATH
} from '@/app/config/config';
import { EfficiencyType } from '@/app/models/EfficiencyType.enum';
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

  getItemImage(itemIdentifier: string, _size: ImageSize = ImageSize.SMALL): string {
    return `${ITEM_RESOURCE_PATH}${itemIdentifier}.png`;
  }

  getSkillImage(skillIdentifier: string, _size: ImageSize = ImageSize.SMALL): string {
    return `${SKILL_RESOURCE_PATH}${skillIdentifier}.png`;
  }

  getEfficiencyTypeImage(efficiencyType: EfficiencyType, _size: ImageSize = ImageSize.SMALL): string {
    return `${MISCELLANEOUS_RESOURCE_PATH}icons/effective-${efficiencyType.toLowerCase()}.png`;
  }
}
