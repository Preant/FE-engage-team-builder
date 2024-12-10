import { SkillID } from '@/app/brands/ResourceID.brand';
import { Resource } from '@/app/models/Resource.model';
import { SkillType } from '@/app/models/SkillType.enum';

export type Skill = Resource & {
    id: SkillID
    name: string;
    skillType: SkillType;
    description: string;
}
