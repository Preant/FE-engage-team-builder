import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';

import { EmblemID, WeaponID } from '@/app/brands/ResourceID.brand';
import { CHARACTER_DATA_PATH, EMBLEM_DATA_PATH, WEAPON_DATA_PATH } from '@/app/config/config';
import { Character } from '@/app/models/Character.model';
import { Emblem } from '@/app/models/Emblem.model';
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

  constructor(http: HttpClient) {
    super(http, EMBLEM_DATA_PATH);
  }

  getEngageWeapons(emblemId: EmblemID) {
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

  // Méthode utilitaire pour vérifier si une arme appartient à un emblème
  isWeaponBelongingToEmblem(weaponId: WeaponID, emblemId: EmblemID): boolean {
    const emblem = this.getResourceById(emblemId);
    return emblem ? emblem.engageWeapons.includes(weaponId) : false;
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
