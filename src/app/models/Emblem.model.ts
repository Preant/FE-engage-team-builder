import { EmblemID, ItemID, WeaponID } from '@/app/brands/ResourceID.brand';
import { Resource } from '@/app/models/Resource.model';

export type Emblem = Resource & {
    id: EmblemID;
    engageWeapons: WeaponID[];
    engageItems: ItemID[];
}
