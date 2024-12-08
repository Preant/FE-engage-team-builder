import { CharacterID, EmblemID, SkillID, WeaponID } from '@/app/brands/ResourceID.brand';

export type Resource = {
    id: CharacterID | EmblemID | WeaponID | SkillID;
    identifier: string;
}
