export type TeamMember = {
    id: number;
    characterId: number | null;
    emblemId: number | null;
    weaponIds: (number | null)[];
}

export type Team = {
    id: number;
    members: TeamMember[];
}
