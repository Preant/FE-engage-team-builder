import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { Character } from '@/app/models/Character.model';
import { CharacterService } from '@/app/services/character.service';

export const characterExistsGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean => {
  const characterService: CharacterService = inject(CharacterService);
  const router: Router = inject(Router);

  const identifier: string | null = route.paramMap.get('identifier');

  if (!identifier) {
    void router.navigate(['/characters']);
    return false;
  }

  const characterExists: Character | undefined = characterService.getCharacterByIdentifier(identifier);

  if (!characterExists) {
    void router.navigate(['/characters']);
    return false;
  }

  return true;
};
