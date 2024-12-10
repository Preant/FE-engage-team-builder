import { CharacterID, EmblemID, SkillID, TeamID, TeamMemberID, WeaponID } from '@/app/brands/ResourceID.brand';

export type SkillSlotIndex = 0 | 1;

export type TeamMember = {
    id: TeamMemberID;
    characterId: CharacterID | null;
    emblemId: EmblemID | null;
    weaponIds: (WeaponID | null)[];
    inheritableSkillIds: [(SkillID | null), (SkillID | null)];
}

export type Team = {
    id: TeamID;
    members: TeamMember[];
}
