import { Branded } from './Branded.type';

export type CharacterID = Branded<number, 'CharacterID'>;
export type EmblemID = Branded<number, 'EmblemID'>;
export type WeaponID = Branded<number, 'WeaponID'>;
export type TeamID = Branded<number, 'TeamID'>;
export type TeamMemberID = Branded<number, 'TeamMemberID'>;

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
