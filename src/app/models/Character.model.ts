import { CharacterID, SkillID } from '@/app/brands/ResourceID.brand';
import { Resource } from '@/app/models/Resource.model';
import { StatSheet } from '@/app/models/StatSheet.model';

export type Character = Resource & {
    id: CharacterID;
    name: string;
    country: string;
    base: StatSheet;
    growth: StatSheet;
    personalSkillId: SkillID
}
