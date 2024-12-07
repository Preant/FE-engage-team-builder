import { computed, Injectable, signal } from '@angular/core';

import { CharacterService, EmblemService, WeaponService } from './resources.service';

import { Team } from '@/app/models/Team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  readonly members = computed(() => this.team().members);
  private readonly teamSignal = signal<Team>({
    id: 1,
    members: [
      { id: 1, characterId: null, emblemId: null, weaponIds: [null, null, null, null] }
    ]
  });
  readonly team = computed(() => this.teamSignal());

  constructor(
        private characterService: CharacterService,
        private emblemService: EmblemService,
        private weaponService: WeaponService
  ) {
  }

  readonly getMemberById = (id: number) => computed(() =>
    this.members().find(m => m.id === id)
  );

  // Actions
  updateMemberCharacter(memberId: number, characterId: number | null) {
    this.teamSignal.update(team => ({
      ...team,
      members: team.members.map(member =>
        member.id === memberId
          ? { ...member, characterId }
          : member
      )
    }));
  }

  updateMemberEmblem(memberId: number, emblemId: number | null) {
    this.teamSignal.update(team => ({
      ...team,
      members: team.members.map(member =>
        member.id === memberId
          ? { ...member, emblemId }
          : member
      )
    }));
  }

  updateMemberWeapon(memberId: number, weaponIndex: number, weaponId: number | null) {
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
  getAvailableCharacters = (memberId: number) => computed(() => {
    const usedIds = new Set(
      this.members()
        .filter(m => m.id !== memberId)
        .map(m => m.characterId)
        .filter((id): id is number => id !== null)
    );

    return this.characterService.getResources()()
      .filter(char => !usedIds.has(char.id));
  });

  getAvailableEmblems = (memberId: number) => computed(() => {
    const usedIds = new Set(
      this.members()
        .filter(m => m.id !== memberId)
        .map(m => m.emblemId)
        .filter((id): id is number => id !== null)
    );

    return this.emblemService.getResources()()
      .filter(emblem => !usedIds.has(emblem.id));
  });

  getAvailableWeapons = (memberId: number, weaponSlotIndex: number) => computed(() => {
    const member = this.getMemberById(memberId)();
    if (!member) {
      return [];
    }

    const selectedWeaponIds = new Set(
      member.weaponIds
        .filter((id, index) => index !== weaponSlotIndex && id !== null)
    );

    return this.weaponService.getResources()()
      .filter(weapon => !selectedWeaponIds.has(weapon.id));
  });

  getMemberWeapons = (memberId: number) => computed(() => {
    const member = this.getMemberById(memberId)();
    if (!member) {
      return [];
    }

    return member.weaponIds.map(weaponId =>
      weaponId ? this.weaponService.getResourceById(weaponId) : null
    );
  });
}
