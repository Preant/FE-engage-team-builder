import { EmblemID, WeaponID } from '@/app/brands/ResourceID.brand';
import { Resource } from '@/app/models/Resource.model';

export type Emblem = Resource & {
    id: EmblemID;
    name: string;
    secondaryIdentifier: string | undefined;
    engageWeapons: WeaponID[];
}
