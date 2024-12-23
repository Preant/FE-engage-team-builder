import { EmblemID, ItemID, WeaponID } from '@/app/brands/ResourceID.brand';
import { Resource } from '@/app/models/Resource.model';
import { StatSheet } from '@/app/models/StatSheet.model';

export type Emblem = Resource & {
    id: EmblemID;
    engageWeapons: WeaponID[];
    engageItems: ItemID[];
    syncStatBonus: Partial<StatSheet>;
}
