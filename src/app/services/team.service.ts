import { computed, effect, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';

import { brandAs } from '@/app/brands/brandAs';
import { CharacterID, ClassID, EmblemID, SkillID, TeamID, TeamMemberID, WeaponID } from '@/app/brands/ResourceID.brand';
import { INHERITABLE_SKILL_SIZE, TEAM_MEMBER_SIZE, WEAPON_BY_MEMBER_SIZE } from '@/app/config/config';
import { Character } from '@/app/models/Character.model';
import { Class } from '@/app/models/Class.model';
import { Emblem } from '@/app/models/Emblem.model';
import { Skill } from '@/app/models/Skill.model';
import { SkillType } from '@/app/models/SkillType.enum';
import { Team, TeamMember } from '@/app/models/Team.model';
import { Weapon } from '@/app/models/Weapon.model';
import { ClassWeaponMasteryLevel, weaponRankToWeaponMasteryLevel } from '@/app/models/WeaponMasteryLevel.enum';
import { WeaponType } from '@/app/models/WeaponType.enum';
import {
  CharacterService,
  ClassService,
  EmblemService,
  SkillService,
  WeaponService
} from '@/app/services/resources.service';
import { getOrdinal } from '@/app/utils/getOrdinal';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  readonly members: Signal<TeamMember[]> = computed((): TeamMember[] => this.activeTeam()?.members ?? []);
  private readonly teamsSignal: WritableSignal<Team[]> = signal<Team[]>([]);
  readonly teams: Signal<Team[]> = this.teamsSignal.asReadonly();
  private characterService: CharacterService = inject(CharacterService);
  private emblemService: EmblemService = inject(EmblemService);
  private weaponService: WeaponService = inject(WeaponService);
  private skillService: SkillService = inject(SkillService);
  private classService: ClassService = inject(ClassService);
  private activeTeamIdSignal: WritableSignal<TeamID | null> = signal<TeamID | null>(null);
  readonly activeTeam: Signal<Team | null> = computed((): Team | null => {
    const id: TeamID | null = this.activeTeamIdSignal();
    return id ? this.getTeamById(id) : null;
  });

  constructor() {
    this.loadTeamFromLocalStorage();

    if (this.teams().length === 0) {
      this.createTeam('Default Team');
    }

    effect(() => {
      const activeTeam: Team | null = this.activeTeam();
      if (activeTeam) {
        this.saveTeamToLocalStorage(activeTeam);
      }
    });
  }

  public getTeamSignal(teamId: TeamID): Signal<Team> {
    return computed((): Team => {
      const team: Team | undefined = this.findTeamById(teamId);
      if (!team) {
        throw new Error(`Team with ID ${teamId} not found`);
      }
      return team;
    });
  }

  createTeam(name: string = 'new Team'): Team {
    const newTeamId: TeamID = this.generateNewTeamId();
    const now: Date = new Date();

    const newTeam: Team = {
      id: newTeamId,
      name,
      createdAt: now,
      lastModified: now,
      members: Array(TEAM_MEMBER_SIZE).fill(null).map((_, index) => ({
        id: brandAs.TeamMemberID(index + 1),
        character: null,
        class: null,
        emblem: null,
        weapons: [null, null, null, null],
        inheritableSkills: [null, null]
      }))
    };

    this.teamsSignal.update((teams: Team[]) => {
      return [...teams, newTeam];
    });

    this.saveTeamToLocalStorage(newTeam);

    return newTeam;
  }

  public findTeamById(teamId: TeamID): Team | undefined {
    return this.teams().find((team: Team) => team.id === teamId);
  }

  public getTeamById(teamId: TeamID): Team {
    const team: Team | undefined = this.findTeamById(teamId);
    if (!team) {
      throw new Error(`Team with ID ${teamId} not found`);
    }
    return team;
  }

  switchTeam(teamId: TeamID | null): void {
    if (teamId === null) {
      this.activeTeamIdSignal.update((): null => null);
      return;
    }
    if (!this.findTeamById(teamId)) {
      throw new Error(`Team with ID ${teamId} not found`);
    }
    this.activeTeamIdSignal.update((): TeamID => teamId);
  }

  public deleteTeam(teamId: TeamID): void {
    this.teamsSignal.update((teams: Team[]): Team[] => teams.filter((team: Team) => team.id !== teamId));

    // Remove team state from local storage
    this.deleteTeamFromLocalStorage(teamId);
  }

  updateTeamName(teamId: TeamID, name: string): void {
    this.teamsSignal.update((teams: Team[]): Team[] => {
      const team: Team | undefined = this.findTeamById(teamId);
      if (!team) {
        throw new Error(`Team with ID ${teamId} not found`);
      }

      const updatedMetadata: Team = {
        ...team,
        name,
        lastModified: new Date()
      };
      return teams.map((team: Team): Team => (team.id === teamId ? updatedMetadata : team));
    });
  }

  public findMemberById(id: number): TeamMember | undefined {
    return this.members().find((m: TeamMember) => m.id === id);
  }

  public getMemberById(id: TeamMemberID): TeamMember {
    const member: TeamMember | undefined = this.members().find((member: TeamMember) => member.id === id);
    if (!member) {
      throw new Error(`Member with ID ${id} not found`);
    }
    return member;
  }

  updateMemberCharacter(memberId: TeamMemberID, characterId: CharacterID | null): void {
    const id: TeamID | null = this.activeTeamIdSignal();
    if (!id) {
      throw new Error('No active team');
    }
    this.teamsSignal.update((teams: Team[]): Team[] => teams.map((team: Team): Team => {
      if (team.id !== id) {
        return team;
      }
      return {
        ...team,
        members: team.members.map((member: TeamMember): TeamMember =>
          member.id === memberId
            ? {
              ...member,
              character: characterId ? this.characterService.getResourceById(characterId) : null
            }
            : member
        )
      };
    }));
  }

  updateMemberClass(memberId: TeamMemberID, classId: ClassID | null): void {
    const id: TeamID | null = this.activeTeamIdSignal();
    if (!id) {
      throw new Error('No active team');
    }
    this.teamsSignal.update((teams: Team[]): Team[] => teams.map((team: Team): Team => {
      if (team.id !== id) {
        return team;
      }
      return {
        ...team,
        members: team.members.map((member: TeamMember): TeamMember =>
          member.id === memberId
            ? { ...member, class: classId ? this.classService.getResourceById(classId) : null }
            : member
        )
      };
    }));
  }

  updateMemberEmblem(memberId: TeamMemberID, emblemId: EmblemID | null): void {
    const id: TeamID | null = this.activeTeamIdSignal();
    if (!id) {
      throw new Error('No active team');
    }
    this.teamsSignal.update((teams: Team[]): Team[] => teams.map((team: Team): Team => {
      if (team.id !== id) {
        return team;
      }
      return {
        ...team,
        members: team.members.map((member: TeamMember): TeamMember =>
          member.id === memberId
            ? { ...member, emblem: emblemId ? this.emblemService.getResourceById(emblemId) : null }
            : member
        )
      };
    }));
  }

  updateMemberWeapon(memberId: TeamMemberID, weaponIndex: number, weaponId: WeaponID | null): void {
    if (weaponIndex < 0 || weaponIndex >= WEAPON_BY_MEMBER_SIZE) {
      throw new Error(`Invalid weapon index ${weaponIndex}`);
    }
    const id: TeamID | null = this.activeTeamIdSignal();
    if (!id) {
      throw new Error('No active team');
    }
    this.teamsSignal.update((teams: Team[]): Team[] => teams.map((team: Team): Team => {
      if (team.id !== id) {
        return team;
      }
      return {
        ...team,
        members: team.members.map((member: TeamMember): TeamMember =>
          member.id === memberId
            ? {
              ...member,
              weapons: member.weapons.map((weapon: Weapon | null, index: number): Weapon | null => {
                if (index !== weaponIndex) {
                  return weapon;
                } else if (weaponId) {
                  return this.weaponService.getResourceById(weaponId);
                }
                return null;
              })
            }
            : member
        )
      };
    }));
  }

  updateMemberInheritableSkill(memberId: TeamMemberID, skillIndex: number, skillId: SkillID | null): void {
    if (skillIndex < 0 || skillIndex >= INHERITABLE_SKILL_SIZE) {
      throw new Error(`Invalid skill index ${skillIndex}`);
    }
    const id: TeamID | null = this.activeTeamIdSignal();
    if (!id) {
      throw new Error('No active team');
    }
    this.teamsSignal.update((teams: Team[]): Team[] => teams.map((team: Team): Team => {
      if (team.id !== id) {
        return team;
      }
      return {
        ...team,
        members: team.members.map((member: TeamMember): TeamMember =>
          member.id === memberId
            ? {
              ...member,
              inheritableSkills: member.inheritableSkills.map((skill: Skill | null, index: number): Skill | null => {
                if (index !== skillIndex) {
                  return skill;
                } else if (skillId) {
                  return this.skillService.getResourceById(skillId);
                }
                return null;
              })
            }
            : member
        )
      };
    }));
  }

  // Computed values for UI
  public getAvailableCharacters(memberId: TeamMemberID): Signal<Character[]> {
    return computed((): Character[] => {
      const usedIds: Set<CharacterID> = new Set<CharacterID>(
        this.members()
          .filter((member: TeamMember) => member.id !== memberId)
          .map((m: TeamMember): CharacterID | undefined | null => m.character?.id)
          .filter((id: CharacterID | undefined | null): id is CharacterID => !!id)
      );

      return this.characterService.resources()
        .filter((character: Character) => !usedIds.has(character.id))
        .filter((character: Character) => {
          const member: TeamMember = this.getMemberById(memberId);
          return !member.class || !member.class.signatureCharacter || member.class.signatureCharacter === character.id;
        })
        .filter((character: Character) => {
          const member: TeamMember = this.getMemberById(memberId);
          return member.weapons.every((weapon: Weapon | null): boolean => {
            if (!weapon || !member.class) {
              return true;
            }
            return !!member.class?.weapons.some(([weaponType, classWeaponMasteryLevel]: [WeaponType, ClassWeaponMasteryLevel]) => {
              let effectiveClassWeaponMasteryLevel: ClassWeaponMasteryLevel = classWeaponMasteryLevel;
              const characterAffinity: WeaponType | undefined = character.innateProficiency;
              switch (classWeaponMasteryLevel) {
                case ClassWeaponMasteryLevel.AA:
                  if (characterAffinity === weaponType) {
                    effectiveClassWeaponMasteryLevel = ClassWeaponMasteryLevel.S;
                  }
                  break;
                case ClassWeaponMasteryLevel.BB:
                  if (characterAffinity === weaponType) {
                    effectiveClassWeaponMasteryLevel = ClassWeaponMasteryLevel.A;
                  }
                  break;
                case ClassWeaponMasteryLevel.CC:
                  if (characterAffinity === weaponType) {
                    effectiveClassWeaponMasteryLevel = ClassWeaponMasteryLevel.B;
                  }
                  break;
                default:
              }
              if (weaponType !== weapon.weaponType) {
                return false;
              }
              return getOrdinal(ClassWeaponMasteryLevel, effectiveClassWeaponMasteryLevel) <= getOrdinal(ClassWeaponMasteryLevel, weaponRankToWeaponMasteryLevel(weapon.rank));
            });
          });
        });
    });
  }

  public getAvailableClasses(memberId: TeamMemberID): Signal<Class[]> {
    return computed((): Class[] => {

      return this.classService.resources()
        .filter((combatClass: Class) => combatClass.isAdvanced)
        .filter((combatClass: Class) => !combatClass.signatureCharacter || combatClass.signatureCharacter === this.getMemberById(memberId).character?.id)
        .filter((combatClass: Class) => {
          const member: TeamMember = this.getMemberById(memberId);
          return member.weapons.every((weapon: Weapon | null): boolean => {
            if (!weapon) {
              return true;
            }
            return combatClass.weapons.some(([weaponType, classWeaponMasteryLevel]: [WeaponType, ClassWeaponMasteryLevel]) => {
              let effectiveClassWeaponMasteryLevel: ClassWeaponMasteryLevel = classWeaponMasteryLevel;
              const characterAffinity: WeaponType | undefined = member.character?.innateProficiency;
              switch (classWeaponMasteryLevel) {
                case ClassWeaponMasteryLevel.AA:
                  if (characterAffinity === weaponType) {
                    effectiveClassWeaponMasteryLevel = ClassWeaponMasteryLevel.S;
                  }
                  break;
                case ClassWeaponMasteryLevel.BB:
                  if (characterAffinity === weaponType) {
                    effectiveClassWeaponMasteryLevel = ClassWeaponMasteryLevel.A;
                  }
                  break;
                case ClassWeaponMasteryLevel.CC:
                  if (characterAffinity === weaponType) {
                    effectiveClassWeaponMasteryLevel = ClassWeaponMasteryLevel.B;
                  }
                  break;
                default:
              }
              if (weaponType !== weapon.weaponType) {
                return false;
              }
              return getOrdinal(ClassWeaponMasteryLevel, effectiveClassWeaponMasteryLevel) <= getOrdinal(ClassWeaponMasteryLevel, weaponRankToWeaponMasteryLevel(weapon.rank));
            });
          }
          );
        });
    });
  }

  public getAvailableEmblems(memberId: TeamMemberID): Signal<Emblem[]> {
    return computed((): Emblem[] => {
      const usedIds: Set<EmblemID> = new Set<EmblemID>(
        this.members()
          .filter((member: TeamMember) => member.id !== memberId)
          .map((m: TeamMember): EmblemID | undefined | null => m.emblem?.id)
          .filter((id: EmblemID | undefined | null): id is EmblemID => !!id)
      );

      return this.emblemService.resources()
        .filter((emblem: Emblem) => !usedIds.has(emblem.id));
    });
  }

  public getAvailableWeapons(memberId: TeamMemberID, weaponSlotIndex: number): Signal<Weapon[]> {
    return computed((): Weapon[] => {
      const member: TeamMember = this.getMemberById(memberId);
      const usedWeaponIds: Set<WeaponID> = new Set<WeaponID>([
        ...member.weapons
          .filter((weapon: Weapon | null): weapon is Weapon => !!weapon)
          .filter((weapon: Weapon): boolean => {
            return member.weapons.findIndex((weaponSearch: Weapon | null) => weaponSearch?.id === weapon.id) !== weaponSlotIndex;
          })
          .map((weapon: Weapon): WeaponID => weapon.id),
        ...this.members()
          .filter((m: TeamMember): boolean => m.id !== memberId)
          .map((m: TeamMember): (Weapon | null)[] => m.weapons)
          .flat()
          .filter((weapon: Weapon | null): weapon is Weapon => !!weapon)
          .filter((weapon: Weapon): boolean => weapon.isUnique)
          .map((weapon: Weapon): WeaponID => weapon.id)
      ]);

      return this.weaponService.resources()
        .filter((weapon: Weapon) => !weapon.isEngageWeapon)
        .filter((weapon: Weapon) => !usedWeaponIds.has(weapon.id))
        .filter((weapon: Weapon): boolean => {
          const combatClass: Class | null = member.class;
          if (!combatClass) {
            return true;
          }
          return combatClass.weapons.some(([weaponType, classWeaponMasteryLevel]: [WeaponType, ClassWeaponMasteryLevel]) => {
            let effectiveClassWeaponMasteryLevel: ClassWeaponMasteryLevel = classWeaponMasteryLevel;
            const characterInnateProficiency: WeaponType | undefined = member.character?.innateProficiency;
            switch (classWeaponMasteryLevel) {
              case ClassWeaponMasteryLevel.AA:
                if (!characterInnateProficiency || characterInnateProficiency === weaponType) {
                  effectiveClassWeaponMasteryLevel = ClassWeaponMasteryLevel.S;
                }
                break;
              case ClassWeaponMasteryLevel.BB:
                if (!characterInnateProficiency || characterInnateProficiency === weaponType) {
                  effectiveClassWeaponMasteryLevel = ClassWeaponMasteryLevel.A;
                }
                break;
              case ClassWeaponMasteryLevel.CC:
                if (!characterInnateProficiency || characterInnateProficiency === weaponType) {
                  effectiveClassWeaponMasteryLevel = ClassWeaponMasteryLevel.B;
                }
                break;
              default:
            }
            if (weaponType !== weapon.weaponType) {
              return false;
            }
            return getOrdinal(ClassWeaponMasteryLevel, effectiveClassWeaponMasteryLevel) <= getOrdinal(ClassWeaponMasteryLevel, weaponRankToWeaponMasteryLevel(weapon.rank));
          });
        });
    });
  }

  public getAvailableInheritableSkills(memberId: TeamMemberID, skillIndex: number): Signal<Skill[]> {
    return computed((): Skill[] => {
      if (skillIndex < 0 || skillIndex >= INHERITABLE_SKILL_SIZE) {
        throw new Error(`Invalid skill index ${skillIndex}`);
      }

      const member: TeamMember = this.getMemberById(memberId);
      const allInheritableSkills: Skill[] = this.skillService.getSkillsByType(SkillType.EMBLEM_INHERITABLE);

      const excludedSkillIds: Set<SkillID> = new Set<SkillID>();
      member.inheritableSkills
        .filter((skill: Skill | null): skill is Skill => !!skill)
        .filter((skill: Skill): boolean => {
          return member.inheritableSkills.findIndex((searchSkill: Skill | null) => searchSkill?.id === skill.id) !== skillIndex;
        })
        .forEach((skill: Skill) => {
          const chain: Skill[] = this.skillService.getSkillEvolveChainBySkillId(skill.id);
          chain.forEach((skill: Skill) => excludedSkillIds.add(skill.id));
        });
      return allInheritableSkills.filter((skill: Skill): boolean =>
        !excludedSkillIds.has(skill.id)
      );
    });
  }

  importTeam(importedTeam: Team): void {
    importedTeam.id = this.generateNewTeamId();
    this.teamsSignal.update((teams: Team[]): Team[] => {
      return [...teams, importedTeam];
    });
    this.saveTeamToLocalStorage(importedTeam);
  }

  private generateNewTeamId(): TeamID {
    const existingIds: TeamID[] = this.teams().map((team: Team): TeamID => team.id);
    const maxId: number = Math.max(...existingIds, 0);
    return brandAs.TeamID(maxId + 1);
  }

  // Local Storage management for team states
  private saveTeamToLocalStorage(team: Team): void {
    //TODO: save ids instead of objects
    localStorage.setItem(`team_${team.id}`, JSON.stringify(team));
  }

  private deleteTeamFromLocalStorage(teamId: TeamID): void {
    localStorage.removeItem(`team_${teamId}`);
  }

  private loadTeamFromLocalStorage(): void {
    const teamIds: string[] = Object.keys(localStorage).filter((key: string): boolean => key.startsWith('team_'));
    const teams: Team[] = teamIds.map((key: string): Team => JSON.parse(localStorage.getItem(key) ?? ''));
    this.teamsSignal.update((): Team[] => teams);
  }
}
