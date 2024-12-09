import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';

import { brandAs } from '@/app/brands/brandAs';
import { CharacterID, EmblemID, TeamMemberID, WeaponID } from '@/app/brands/ResourceID.brand';
import { Team, TeamMember } from '@/app/models/Team.model';
import { CharacterService, EmblemService, WeaponService } from '@/app/services/resources.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  readonly members: Signal<TeamMember[]> = computed(() => this.team().members);
  private readonly teamSignal: WritableSignal<Team> = signal<Team>({
    id: brandAs.TeamID(1),
    members: [
      {
        id: brandAs.TeamMemberID(1),
        characterId: null,
        emblemId: null,
        weaponIds: [null, null, null, null]
      }
    ]
  });
  readonly team: Signal<Team> = computed(() => this.teamSignal());

  constructor(
        private characterService: CharacterService,
        private emblemService: EmblemService,
        private weaponService: WeaponService
  ) {
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
