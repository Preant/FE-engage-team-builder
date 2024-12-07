import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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
  constructor(http: HttpClient) {
    super(http, EMBLEM_DATA_PATH);
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
