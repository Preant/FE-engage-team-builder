import { TeamID, TeamMemberID } from '@/app/brands/ResourceID.brand';
import { Character } from '@/app/models/Character.model';
import { Class } from '@/app/models/Class.model';
import { Emblem } from '@/app/models/Emblem.model';
import { Role } from '@/app/models/Role.enum';
import { Skill } from '@/app/models/Skill.model';
import { Staff } from '@/app/models/Staff.model';
import { Weapon } from '@/app/models/Weapon.model';

export type TeamMember = {
    id: TeamMemberID;
    character: Character | null;
    class: Class | null;
    emblem: Emblem | null;
    weapons: (Weapon | Staff | null)[];
    inheritableSkills: (Skill | null)[];
    role: Role | null;
}

export function isWeapon(item: Weapon | Staff | null): item is Weapon {
  return item !== null && 'weaponType' in item;
}

export function isStaff(item: Weapon | Staff | null): item is Staff {
  return item !== null && !('weaponType' in item);
}

export type Team = {
    id: TeamID;
    name: string;
    createdAt: Date;
    lastModified: Date;
    members: TeamMember[];
}
