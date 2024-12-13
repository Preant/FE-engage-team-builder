import { Resource } from './Resource.model';

import { WeaponID } from '@/app/brands/ResourceID.brand';
import { EfficiencyType } from '@/app/models/EfficiencyType.enum';
import { WeaponMasteryLevel } from '@/app/models/WeaponMasteryLevel.enum';
import { WeaponType } from '@/app/models/WeaponType.enum';

export type Weapon = Resource & {
    id: WeaponID;
    might: number;
    hit: number;
    crit: number;
    range: [number, number];
    weight: number;
    weaponType: WeaponType;
    rank: WeaponMasteryLevel;
    price: number;
    description: string;
    KnocksBack: boolean;
    effectiveness: EfficiencyType[];
    isEngageWeapon: boolean;
    isUnique: boolean;
}
