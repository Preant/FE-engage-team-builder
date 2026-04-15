import { Resource } from './Resource.model';

import { StaffID } from '@/app/brands/ResourceID.brand';
import { WeaponMasteryLevel } from '@/app/models/WeaponMasteryLevel.enum';

export type Staff = Resource & {
    id: StaffID;
    heal: number;
    hit: number;
    range: [number, number];
    weight: number;
    rank: WeaponMasteryLevel;
    price: number;
    description: string;
    isEngageWeapon: boolean;
    isUnique: boolean;
}
