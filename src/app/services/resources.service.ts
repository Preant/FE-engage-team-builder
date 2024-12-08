import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal } from '@angular/core';

import { EmblemID, WeaponID } from '@/app/brands/ResourceID.brand';
import {
  CHARACTER_DATA_PATH,
  EMBLEM_DATA_PATH,
  ITEM_DATA_PATH,
  SKILL_DATA_PATH,
  WEAPON_DATA_PATH
} from '@/app/config/config';
import { Character } from '@/app/models/Character.model';
import { Emblem } from '@/app/models/Emblem.model';
import { Item } from '@/app/models/Item.model';
import { Skill } from '@/app/models/Skill.model';
import { SkillType } from '@/app/models/SkillType.enum';
import { Weapon } from '@/app/models/Weapon.model';
import { GenericResourceService } from '@/app/services/generic-resource.service.tsd';

@Injectable({
  providedIn: 'root'
})
export class CharacterService extends GenericResourceService<Character> {
  constructor(http: HttpClient) {
    super(http, CHARACTER_DATA_PATH);
  }
}

@Injectable({
  providedIn: 'root'
})
export class EmblemService extends GenericResourceService<Emblem> {
  private weaponService: WeaponService = inject(WeaponService);
  private itemService: ItemService = inject(ItemService);

  constructor(http: HttpClient) {
    super(http, EMBLEM_DATA_PATH);
  }

  getEngageWeapons(emblemId: EmblemID): Signal<Weapon[]> {
    return computed(() => {
      const emblem = this.getResourceById(emblemId);
      if (!emblem) {
        return [];
      }

      return emblem.engageWeapons
        .map(weaponId => this.weaponService.getResourceById(weaponId))
        .filter((weapon): weapon is Weapon =>
          weapon !== undefined && weapon.isEngageWeapon
        );
    });
  }

  isWeaponBelongingToEmblem(weaponId: WeaponID, emblemId: EmblemID): boolean {
    const emblem = this.getResourceById(emblemId);
    return emblem ? emblem.engageWeapons.includes(weaponId) : false;
  }

  getEngageItems(emblemId: EmblemID): Signal<Item[]> {
    return computed(() => {
      const emblem = this.getResourceById(emblemId);
      if (!emblem) {
        return [];
      }

      return emblem.engageItems
        .map(itemId => this.itemService.getResourceById(itemId))
        .filter((item): item is Item => item !== undefined);
    });
  }

  getEmblemTools(emblemId: EmblemID): Signal<(Weapon | Item)[]> {
    return computed(() => {
      const emblem = this.getResourceById(emblemId);
      if (!emblem) {
        return [];
      }

      return [
        ...this.getEngageWeapons(emblemId)(),
        ...this.getEngageItems(emblemId)()
      ];
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class WeaponService extends GenericResourceService<Weapon> {
  constructor(http: HttpClient) {
    super(http, WEAPON_DATA_PATH);
  }
}

@Injectable({
  providedIn: 'root'
})
export class SkillService extends GenericResourceService<Skill> {
  constructor(http: HttpClient) {
    super(http, SKILL_DATA_PATH);
  }

  getSkillsByType(type: SkillType): Skill[] {
    return this.resources().filter((skill: Skill) => skill.skillType === type);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ItemService extends GenericResourceService<Item> {
  constructor(http: HttpClient) {
    super(http, ITEM_DATA_PATH);
  }
}
