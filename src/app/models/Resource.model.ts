import { CharacterID, EmblemID, WeaponID } from '@/app/brands/ResourceID.brand';

export type Resource = {
    id: CharacterID | EmblemID | WeaponID;
    identifier: string;
}
