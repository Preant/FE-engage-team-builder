import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

import { Weapon } from '@/app/models/Weapon.model';
import { WeaponService } from '@/app/services/weapon.service';

export const weaponExistsGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const weaponService: WeaponService = inject(WeaponService);
  const router: Router = inject(Router);
  const identifier: string | null = route.paramMap.get('identifier');

  if (!identifier) {
    void router.navigate(['/weapons']);
    return false;
  }

  const weapon: Weapon | undefined = weaponService.getWeaponByIdentifier(identifier);
  if (!weapon) {
    void router.navigate(['/weapons']);
    return false;
  }

  return true;
};
