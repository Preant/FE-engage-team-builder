import { Role } from '@/app/models/Role.enum';
import { TeamMember, isStaff } from '@/app/models/Team.model';
import { WeaponType } from '@/app/models/WeaponType.enum';

const HEALING_SUPPORT_EMBLEMS = ['celica', 'micaiah', 'veronica'];

export function canMemberHeal(member: TeamMember): boolean {
  const hasStaffEquipped = member.weapons.some(weapon => isStaff(weapon));
  if (hasStaffEquipped) {
    return true;
  }

  const classHasStaffAccess = member.class?.weapons.some(([weaponType]) => weaponType === WeaponType.STAFF) ?? false;
  if (classHasStaffAccess) {
    return true;
  }

  const emblemIdentifier = member.emblem?.identifier;
  return emblemIdentifier ? HEALING_SUPPORT_EMBLEMS.includes(emblemIdentifier) : false;
}

export function getRoleIcon(role: Role): string {
  switch (role) {
    case Role.TANK:
      return 'pi-shield';
    case Role.DPS:
      return 'pi-bolt';
    case Role.BRUISER:
      return 'pi-hammer';
    case Role.SCOUT:
      return 'pi-arrow-right';
    case Role.SUPPORT:
      return 'pi-star-fill';
    default:
      return 'pi-circle';
  }
}

export function getRoleColor(role: Role | null): string {
  switch (role) {
    case Role.TANK:
      return 'text-air_superiority_blue-500';
    case Role.DPS:
      return 'text-red-500';
    case Role.BRUISER:
      return 'text-orange-500';
    case Role.SCOUT:
      return 'text-blue-500';
    case Role.SUPPORT:
      return 'text-indigo-500';
    default:
      return 'text-gray-400';
  }
}

export function getRoleBgClass(role: Role | null): string {
  const base = 'border border-rich_black-500 ';
  switch (role) {
    case Role.TANK:
      return base + 'bg-air_superiority_blue-700';
    case Role.DPS:
      return base + 'bg-red-700';
    case Role.BRUISER:
      return base + 'bg-orange-700';
    case Role.SCOUT:
      return base + 'bg-blue-600';
    case Role.SUPPORT:
      return base + 'bg-indigo-600';
    default:
      return base + 'bg-gunmetal-600';
  }
}
