import { SkillID } from '@/app/brands/ResourceID.brand';
import { Resource } from '@/app/models/Resource.model';
import { SkillType } from '@/app/models/SkillType.enum';

export type Skill = Resource & {
    id: SkillID
    skillType: SkillType;
    evolvedFrom: SkillID | null;
    description: string;
}
