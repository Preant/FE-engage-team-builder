import { computed, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';

import { brandAs } from '@/app/brands/brandAs';
import { CharacterID, EmblemID, SkillID, TeamMemberID, WeaponID } from '@/app/brands/ResourceID.brand';
import { Skill } from '@/app/models/Skill.model';
import { SkillType } from '@/app/models/SkillType.enum';
import { SkillSlotIndex, Team, TeamMember } from '@/app/models/Team.model';
import { CharacterService, EmblemService, SkillService, WeaponService } from '@/app/services/resources.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private characterService: CharacterService = inject(CharacterService);
  private emblemService: EmblemService = inject(EmblemService);
  private weaponService: WeaponService = inject(WeaponService);
  private skillService: SkillService = inject(SkillService);
  private readonly teamSignal: WritableSignal<Team> = signal<Team>({
    id: brandAs.TeamID(1),
    members: [
      {
        id: brandAs.TeamMemberID(1),
        characterId: null,
        emblemId: null,
        weaponIds: [null, null, null, null],
        inheritableSkillIds: [null, null] // Initialize with tuple
      }
    ]
  });
  readonly team: Signal<Team> = computed(() => this.teamSignal());
  readonly members: Signal<TeamMember[]> = computed(() => this.team().members);

  constructor() {
  }

  readonly findMemberById = (id: number) => computed(() =>
    this.members().find(m => m.id === id));

  readonly getMemberById = (id: TeamMemberID) => computed(() => {
    const member: TeamMember | undefined = this.members().find(m => m.id === id);
    if (!member) {
      throw new Error(`Member with ID ${id} not found`);
    }
    return member;
  });

  updateMemberCharacter(memberId: TeamMemberID, characterId: CharacterID | null) {
    this.teamSignal.update(team => ({
      ...team,
      members: team.members.map(member =>
        member.id === memberId
          ? { ...member, characterId }
          : member
      )
    }));
  }

  updateMemberEmblem(memberId: TeamMemberID, emblemId: EmblemID | null) {
    this.teamSignal.update(team => ({
      ...team,
      members: team.members.map(member =>
        member.id === memberId
          ? { ...member, emblemId }
          : member
      )
    }));
  }

  updateMemberWeapon(memberId: TeamMemberID, weaponIndex: number, weaponId: WeaponID | null) {
    this.teamSignal.update(team => ({
      ...team,
      members: team.members.map(member =>
        member.id === memberId
          ? {
            ...member,
            weaponIds: member.weaponIds.map((id, index) =>
              index === weaponIndex ? weaponId : id
            )
          }
          : member
      )
    }));
  }

  updateMemberSkill(memberId: TeamMemberID, skillIndex: SkillSlotIndex, skillId: SkillID | null) {
    this.teamSignal.update(team => ({
      ...team,
      members: team.members.map(member =>
        member.id === memberId
          ? {
            ...member,
            inheritableSkillIds: skillIndex === 0
              ? [skillId, member.inheritableSkillIds[1]]
              : [member.inheritableSkillIds[0], skillId]
          }
          : member
      )
    }));
  }

  // Computed values for UI
  getAvailableCharacters = (memberId: TeamMemberID) => computed(() => {
    const usedIds = new Set<CharacterID>(
      this.members()
        .filter(m => m.id !== memberId)
        .map(m => m.characterId)
        .filter((id): id is CharacterID => id !== null)
    );

    return this.characterService.getResources()()
      .filter(char => !usedIds.has(char.id));
  });

  getAvailableEmblems = (memberId: TeamMemberID) => computed(() => {
    const usedIds = new Set<EmblemID>(
      this.members()
        .filter(m => m.id !== memberId)
        .map(m => m.emblemId)
        .filter((id): id is EmblemID => id !== null)
    );

    return this.emblemService.getResources()()
      .filter(emblem => !usedIds.has(emblem.id));
  });

  getAvailableWeapons = (memberId: TeamMemberID, weaponSlotIndex: number) => computed(() => {
    const member = this.getMemberById(memberId)();
    if (!member) {
      return [];
    }

    const selectedWeaponIds = new Set<WeaponID>(
      member.weaponIds
        .filter((id, index): id is WeaponID =>
          index !== weaponSlotIndex && id !== null
        )
    );

    return this.weaponService.getResources()()
      .filter(weapon => !weapon.isEngageWeapon)
      .filter(weapon => !selectedWeaponIds.has(weapon.id));
  });


  getAvailableInheritableSkills = (memberId: TeamMemberID, skillIndex: SkillSlotIndex) => computed(() => {
    const member = this.getMemberById(memberId)();
    if (!member) {
      return [];
    }

    const otherSkillId = member.inheritableSkillIds[skillIndex === 0 ? 1 : 0];

    return this.skillService.getSkillsByType(SkillType.EMBLEM_INHERITABLE)
      .filter(skill => skill.id !== otherSkillId);
  });


  getMemberSkills = (memberId: TeamMemberID) => computed(() => {
    const member = this.getMemberById(memberId)();
    if (!member) {
      return [null, null] as [Skill | null, Skill | null];
    }

    return [
      member.inheritableSkillIds[0] ? this.skillService.getResourceById(member.inheritableSkillIds[0]) : null,
      member.inheritableSkillIds[1] ? this.skillService.getResourceById(member.inheritableSkillIds[1]) : null
    ] as [Skill | null, Skill | null];
  });

  getMemberWeapons = (memberId: TeamMemberID) => computed(() => {
    const member = this.getMemberById(memberId)();
    if (!member) {
      return [];
    }

    return member.weaponIds.map(weaponId =>
      weaponId ? this.weaponService.getResourceById(weaponId) : null
    );
  });
}
