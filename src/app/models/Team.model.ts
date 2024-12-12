import { TeamID, TeamMemberID } from '@/app/brands/ResourceID.brand';
import { Character } from '@/app/models/Character.model';
import { Emblem } from '@/app/models/Emblem.model';
import { Skill } from '@/app/models/Skill.model';
import { Weapon } from '@/app/models/Weapon.model';

export type TeamMember = {
    id: TeamMemberID;
    character: Character | null;
    emblem: Emblem | null;
    weapons: (Weapon | null)[];
    inheritableSkills: (Skill | null)[];
}

export type Team = {
    id: TeamID;
    members: TeamMember[];
}
