import { Resource } from './Resource.model';

import { WeaponID } from '@/app/brands/ResourceID.brand';
import { EfficiencyType } from '@/app/models/EfficiencyType.enum';
import { WeaponType } from '@/app/models/WeaponType.enum';

export type Weapon = Resource & {
    id: WeaponID;
    name: string;
    might: number;
    hit: number;
    crit: number;
    range: [number, number];
    weight: number;
    weaponType: WeaponType;
    weaponRank: string;
    price: number;
    description: string;
    KnocksBack: boolean;
    effectiveness: EfficiencyType[];
    isEngageWeapon: boolean;
}
