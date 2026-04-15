import { ClassType } from '@/app/models/ClassType.enum';
import { WeaponType } from '@/app/models/WeaponType.enum';

export interface ClassFilters {
  classTypes: Set<ClassType>;
  weaponTypes: Set<WeaponType>;
  isAdvanced: boolean | null;
  searchQuery: string;
}
