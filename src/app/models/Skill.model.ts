import { Resource } from '@/app/models/Resource.model';
import { SkillType } from '@/app/models/SkillType.enum';

export type Skill = Resource & {
    iconUrl: string;
    name: string;
    skillType: SkillType;
    description: string;
}
