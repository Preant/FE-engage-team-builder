import { CharacterID, ClassID, SkillID } from '@/app/brands/ResourceID.brand';
import { ClassType } from '@/app/models/ClassType.enum';
import { EfficiencyType } from '@/app/models/EfficiencyType.enum';
import { Resource } from '@/app/models/Resource.model';
import { StatSheet } from '@/app/models/StatSheet.model';
import { ClassWeaponMasteryLevel } from '@/app/models/WeaponMasteryLevel.enum';
import { WeaponType } from '@/app/models/WeaponType.enum';

export type Class = Resource & {
    id: ClassID;
    weapons: [WeaponType, ClassWeaponMasteryLevel][];
    type: ClassType;
    evolvedFrom: ClassID | null;
    weakness: EfficiencyType[];
    isAdvanced: boolean;
    skill: SkillID | null;
    signatureCharacter: CharacterID | null;
    stats: {
        base: StatSheet;
        growth: StatSheet;
        max: StatSheet;
    }
}
