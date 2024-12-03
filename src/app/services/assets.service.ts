import { Injectable } from '@angular/core';

import { CHARACTER_RESOURCE_PATH, EMBLEM_RESOURCE_PATH } from '@/app/config/config';

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
    return `${EMBLEM_RESOURCE_PATH}${emblemIdentifier}/${emblemIdentifier}_portrait.png`;
  }
}
