import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';

import { brandAs } from '@/app/brands/brandAs';
import { CharacterID, EmblemID, SkillID, TeamMemberID, WeaponID } from '@/app/brands/ResourceID.brand';
import { INHERITABLE_SKILL_SIZE, TEAM_MEMBER_SIZE, WEAPON_BY_MEMBER_SIZE } from '@/app/config/config';
import { Character } from '@/app/models/Character.model';
import { Emblem } from '@/app/models/Emblem.model';
import { Skill } from '@/app/models/Skill.model';
import { SkillType } from '@/app/models/SkillType.enum';
import { Team, TeamMember } from '@/app/models/Team.model';
import { Weapon } from '@/app/models/Weapon.model';
import { CharacterService, EmblemService, SkillService, WeaponService } from '@/app/services/resources.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  debugMemberState = {
    callCount: 0,
    lastMembersSignal: null as any
  };
  private characterService: CharacterService = inject(CharacterService);
  private emblemService: EmblemService = inject(EmblemService);
  private weaponService: WeaponService = inject(WeaponService);
  private skillService: SkillService = inject(SkillService);
  private readonly teamSignal: WritableSignal<Team> = signal<Team>({
    id: brandAs.TeamID(1),
    members: Array(TEAM_MEMBER_SIZE).fill(null).map((_, index) => ({
      id: brandAs.TeamMemberID(index + 1),
      character: null,
      emblem: null,
      weapons: [null, null, null, null],
      inheritableSkills: [null, null]
    }))
  });
  readonly team: Signal<Team> = this.teamSignal.asReadonly();
  readonly members: Signal<TeamMember[]> = computed(() => this.team().members);

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
    this.teamSignal.update((team: Team): Team => ({
      ...team,
      members: team.members.map((member: TeamMember): TeamMember =>
        member.id === memberId
          ? { ...member, character: characterId ? this.characterService.getResourceById(characterId) : null }
          : member
      )
    }));
  }

  updateMemberEmblem(memberId: TeamMemberID, emblemId: EmblemID | null) {
    this.teamSignal.update((team: Team): Team => ({
      ...team,
      members: team.members.map((member: TeamMember) =>
        member.id === memberId
          ? { ...member, emblem: emblemId ? this.emblemService.getResourceById(emblemId) : null }
          : member
      )
    }));
  }

  updateMemberWeapon(memberId: TeamMemberID, weaponIndex: number, weaponId: WeaponID | null) {
    if (weaponIndex < 0 || weaponIndex >= WEAPON_BY_MEMBER_SIZE) {
      throw new Error(`Invalid weapon index ${weaponIndex}`);
    }
    this.teamSignal.update((team: Team): Team => ({
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
    }));
  }

  updateMemberInheritableSkill(memberId: TeamMemberID, skillIndex: number, skillId: SkillID | null) {
    if (skillIndex < 0 || skillIndex >= INHERITABLE_SKILL_SIZE) {
      throw new Error(`Invalid skill index ${skillIndex}`);
    }
    this.teamSignal.update((team: Team): Team => ({
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
    }));
    console.log('Updated team:', this.team());
  }

  // Computed values for UI
  public getAvailableCharacters(memberId: TeamMemberID): Signal<Character[]> {
    console.log('getAvailableCharacters');
    return computed((): Character[] => {
      console.log('computing available characters');
      const usedIds: Set<CharacterID> = new Set<CharacterID>(
        this.members()
          .filter((member: TeamMember) => member.id !== memberId)
          .map((m: TeamMember): CharacterID | undefined | null => m.character?.id)
          .filter((id: CharacterID | undefined | null): id is CharacterID => !!id)
      );

      return this.characterService.resources()
        .filter((character: Character) => !usedIds.has(character.id));
    });
  }

  public getAvailableEmblems(memberId: TeamMemberID): Signal<Emblem[]> {
    console.log('getAvailableEmblems');
    return computed((): Emblem[] => {
      console.log('computing available emblems');
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
    console.log('getAvailableWeapons');
    return computed((): Weapon[] => {
      console.log('computing available weapons');
      const member: TeamMember = this.getMemberById(memberId);
      const usedWeaponIds: Set<WeaponID> = new Set<WeaponID>([
        //add weapons from other slots
        ...member.weapons
          .filter((weapon: Weapon | null): weapon is Weapon => !!weapon)
          .filter((weapon: Weapon): boolean => {
            return member.weapons.findIndex((weaponSearch: Weapon | null) => weaponSearch?.id === weapon.id) !== weaponSlotIndex;
          })
          .map((weapon: Weapon): WeaponID => weapon.id),
        // add unique weapon ids from other members
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
        .filter((weapon: Weapon) => !usedWeaponIds.has(weapon.id));
    });
  }

  public getAvailableInheritableSkills(memberId: TeamMemberID, skillIndex: number): Signal<Skill[]> {
    console.log('getAvailableInheritableSkills');
    return computed((): Skill[] => {
      console.log('computing available inheritable skills');
      if (skillIndex < 0 || skillIndex >= INHERITABLE_SKILL_SIZE) {
        throw new Error(`Invalid skill index ${skillIndex}`);
      }

      const member: TeamMember = this.getMemberById(memberId);
      const allInheritableSkills: Skill[] = this.skillService.getSkillsByType(SkillType.EMBLEM_INHERITABLE);

      // Get all skills in evolution chains of selected skills
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
}
