import { CharacterID, ClassID, EmblemID, ItemID, SkillID, WeaponID } from '@/app/brands/ResourceID.brand';

export type ResourceID = CharacterID | EmblemID | WeaponID | SkillID | ItemID | ClassID;

export type Resource = {
    id: ResourceID;
    name: string;
    identifier: string;
}
