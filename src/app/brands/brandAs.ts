import { characterID, emblemID, itemID, skillID, teamID, teamMemberID, weaponID } from './ResourceID.brand';

export const brandAs = {
  CharacterID: characterID,
  EmblemID: emblemID,
  WeaponID: weaponID,
  TeamID: teamID,
  TeamMemberID: teamMemberID,
  SkillID: skillID,
  ItemID: itemID
} as const;
