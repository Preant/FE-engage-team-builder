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
import { ImageType } from '@/app/models/ImageSize.enum';
import { WeaponType } from '@/app/models/WeaponType.enum';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  constructor() {
  }

  getCharacterImage(characterIdentifier: string, size: ImageType = ImageType.BODY_SMALL): string {
    if (size === ImageType.BODY_SMALL) {
      return `${CHARACTER_RESOURCE_PATH}${characterIdentifier}/${characterIdentifier}_body_small.png`;
    } else if (size === ImageType.BANNER_SMALL) {
      return `${CHARACTER_RESOURCE_PATH}${characterIdentifier}/${characterIdentifier}_banner_small.png`;
    } else if (size === ImageType.STAMP) {
      return `${CHARACTER_RESOURCE_PATH}${characterIdentifier}/${characterIdentifier}_stamp.png`;
    }
    return `${CHARACTER_RESOURCE_PATH}${characterIdentifier}/${characterIdentifier}_body.png`;
  }

  getEmblemImage(identifier: string, size: ImageType = ImageType.BODY_SMALL): string {
    if (size === ImageType.BODY_SMALL) {
      return `${EMBLEM_RESOURCE_PATH}${identifier}/${identifier}_body_small.png`;
    } else if (size === ImageType.BANNER_SMALL) {
      return `${EMBLEM_RESOURCE_PATH}${identifier}/${identifier}_banner.png`;
    } else if (size === ImageType.STAMP) {
      return `${EMBLEM_RESOURCE_PATH}${identifier}/${identifier}_stamp.png`;
    }
    return `${EMBLEM_RESOURCE_PATH}${identifier}/${identifier}_body.png`;
  }

  getWeaponImage(weaponIdentifier: string, _size: ImageType = ImageType.BODY_SMALL): string {
    return `${WEAPON_RESOURCE_PATH}${weaponIdentifier}.png`;
  }

  getItemImage(itemIdentifier: string, _size: ImageType = ImageType.BODY_SMALL): string {
    return `${ITEM_RESOURCE_PATH}${itemIdentifier}.png`;
  }

  getSkillImage(skillIdentifier: string, _size: ImageType = ImageType.BODY_SMALL): string {
    return `${SKILL_RESOURCE_PATH}${skillIdentifier}.png`;
  }

  getEfficiencyTypeImage(efficiencyType: EfficiencyType, _size: ImageType = ImageType.BODY_SMALL): string {
    return `${MISCELLANEOUS_RESOURCE_PATH}icons/effective-${efficiencyType.toLowerCase()}.png`;
  }

  getWeaponTypeImage(weaponType: WeaponType): string {
    return `${MISCELLANEOUS_RESOURCE_PATH}icons/weapon-${weaponType.toLowerCase()}.png`;
  }
}
