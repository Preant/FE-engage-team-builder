import { CharacterID, EmblemID, TeamID, TeamMemberID, WeaponID } from '@/app/brands/ResourceID.brand';

export type TeamMember = {
    id: TeamMemberID;
    characterId: CharacterID | null;
    emblemId: EmblemID | null;
    weaponIds: (WeaponID | null)[];
}

export type Team = {
    id: TeamID;
    members: TeamMember[];
}
