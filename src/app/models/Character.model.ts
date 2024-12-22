import { CharacterID, SkillID } from '@/app/brands/ResourceID.brand';
import { Country } from '@/app/models/Country.enum';
import { Resource } from '@/app/models/Resource.model';
import { StatSheet } from '@/app/models/StatSheet.model';
import { WeaponType } from '@/app/models/WeaponType.enum';

export type Character = Resource & {
    id: CharacterID;
    country: Country;
    base: StatSheet;
    growth: StatSheet;
    personalSkillId: SkillID,
    proficiencies: WeaponType[],
    innateProficiency: WeaponType
}
