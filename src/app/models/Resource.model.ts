import { CharacterID, EmblemID, ItemID, SkillID, WeaponID } from '@/app/brands/ResourceID.brand';

export type ResourceID = CharacterID | EmblemID | WeaponID | SkillID | ItemID;

export type Resource = {
    id: ResourceID;
    name: string;
    identifier: string;
}
