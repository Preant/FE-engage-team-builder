import { characterID, emblemID, teamID, teamMemberID, weaponID } from './ResourceID.brand';

export const brandAs = {
  CharacterID: characterID,
  EmblemID: emblemID,
  WeaponID: weaponID,
  TeamID: teamID,
  TeamMemberID: teamMemberID
} as const;
