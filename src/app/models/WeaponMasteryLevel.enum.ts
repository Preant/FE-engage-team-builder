export enum WeaponMasteryLevel {
    S = 'S',
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
}

export enum ClassWeaponMasteryLevel {
    S = 'S',
    AA = 'AA',
    A = 'A',
    BB = 'BB',
    B = 'B',
    CC = 'CC',
    C = 'C',
    D = 'D'
}

export function weaponRankToWeaponMasteryLevel(rank: WeaponMasteryLevel): WeaponMasteryLevel {
  switch (rank) {
    case WeaponMasteryLevel.S:
      return WeaponMasteryLevel.S;
    case WeaponMasteryLevel.A:
      return WeaponMasteryLevel.A;
    case WeaponMasteryLevel.B:
      return WeaponMasteryLevel.B;
    case WeaponMasteryLevel.C:
      return WeaponMasteryLevel.C;
    case WeaponMasteryLevel.D:
      return WeaponMasteryLevel.D;
    default:
      throw new Error(`Invalid weapon rank: ${rank}`);
  }
}
