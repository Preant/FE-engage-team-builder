import { CharacterID, EmblemID, ItemID, SkillID, TeamID, TeamMemberID, WeaponID } from '@/app/brands/ResourceID.brand';

export function characterID(id: number): CharacterID {
  return id as CharacterID;
}

export function emblemID(id: number): EmblemID {
  return id as EmblemID;
}

export function weaponID(id: number): WeaponID {
  return id as WeaponID;
}

export function teamID(id: number): TeamID {
  return id as TeamID;
}

export function teamMemberID(id: number): TeamMemberID {
  return id as TeamMemberID;
}

export function skillID(id: number): SkillID {
  return id as SkillID;
}

export function itemID(id: number): ItemID {
  return id as ItemID;
}
