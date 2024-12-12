import { CharacterID, EmblemID, ItemID, SkillID, TeamID, TeamMemberID, WeaponID } from '@/app/brands/ResourceID.brand';
import { TEAM_MEMBER_SIZE } from '@/app/config/config';

export function characterID(id: number): CharacterID {
  if (!greaterThanZero(id)) {
    throw new Error('Character ID must be greater than 0');
  }
  return id as CharacterID;
}

export function emblemID(id: number): EmblemID {
  if (!greaterThanZero(id)) {
    throw new Error('Emblem ID must be greater than 0');
  }
  return id as EmblemID;
}

export function weaponID(id: number): WeaponID {
  if (!greaterThanZero(id)) {
    throw new Error('Weapon ID must be greater than 0');
  }
  return id as WeaponID;
}

export function teamID(id: number): TeamID {
  if (!greaterThanZero(id)) {
    throw new Error('Team ID must be greater than 0');
  }
  return id as TeamID;
}

export function teamMemberID(id: number): TeamMemberID {
  if (!greaterThanZero(id)) {
    throw new Error('Team Member ID must be greater than 0');
  }
  if (id > TEAM_MEMBER_SIZE) {
    throw new Error(`Team Member ID must be less than or equal to ${TEAM_MEMBER_SIZE}`);
  }
  return id as TeamMemberID;
}

export function skillID(id: number): SkillID {
  if (!greaterThanZero(id)) {
    throw new Error('Skill ID must be greater than 0');
  }
  return id as SkillID;
}

export function itemID(id: number): ItemID {
  if (!greaterThanZero(id)) {
    throw new Error('Item ID must be greater than 0');
  }
  return id as ItemID;
}

function greaterThanZero(id: number): boolean {
  return id > 0;
}
