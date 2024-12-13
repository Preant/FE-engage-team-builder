import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal } from '@angular/core';

import { EmblemID, SkillID, WeaponID } from '@/app/brands/ResourceID.brand';
import {
  CHARACTER_DATA_PATH,
  CLASS_DATA_PATH,
  EMBLEM_DATA_PATH,
  ITEM_DATA_PATH,
  SKILL_DATA_PATH,
  WEAPON_DATA_PATH
} from '@/app/config/config';
import { Character } from '@/app/models/Character.model';
import { Class } from '@/app/models/Class.model';
import { Emblem } from '@/app/models/Emblem.model';
import { Item } from '@/app/models/Item.model';
import { Skill } from '@/app/models/Skill.model';
import { SkillType } from '@/app/models/SkillType.enum';
import { Weapon } from '@/app/models/Weapon.model';
import { GenericResourceService } from '@/app/services/generic-resource.service.tsd';

@Injectable({
  providedIn: 'root'
})
export class CharacterService extends GenericResourceService<Character> {
  constructor(http: HttpClient) {
    super(http, CHARACTER_DATA_PATH);
  }
}

@Injectable({
  providedIn: 'root'
})
export class EmblemService extends GenericResourceService<Emblem> {
  private weaponService: WeaponService = inject(WeaponService);
  private itemService: ItemService = inject(ItemService);

  constructor(http: HttpClient) {
    super(http, EMBLEM_DATA_PATH);
  }

  getEngageWeapons(emblemId: EmblemID): Signal<Weapon[]> {
    return computed(() => {
      const emblem: Emblem = this.getResourceById(emblemId);

      return emblem.engageWeapons
        .map(weaponId => this.weaponService.getResourceById(weaponId))
        .filter((weapon): weapon is Weapon =>
          weapon !== undefined && weapon.isEngageWeapon
        );
    });
  }

  isWeaponBelongingToEmblem(weaponId: WeaponID, emblemId: EmblemID): boolean {
    const emblem = this.getResourceById(emblemId);
    return emblem ? emblem.engageWeapons.includes(weaponId) : false;
  }

  getEngageItems(emblemId: EmblemID): Signal<Item[]> {
    return computed(() => {
      const emblem: Emblem = this.getResourceById(emblemId);

      return emblem.engageItems
        .map(itemId => this.itemService.getResourceById(itemId))
        .filter((item): item is Item => item !== undefined);
    });
  }

  getEmblemTools(emblemId: EmblemID): Signal<(Weapon | Item)[]> {
    return computed(() => {
      return [
        ...this.getEngageWeapons(emblemId)(),
        ...this.getEngageItems(emblemId)()
      ];
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class WeaponService extends GenericResourceService<Weapon> {
  constructor(http: HttpClient) {
    super(http, WEAPON_DATA_PATH);
  }
}

@Injectable({
  providedIn: 'root'
})
export class SkillService extends GenericResourceService<Skill> {
  skillEvolveChain: Signal<Skill[][]> = computed(() => {
    const skills: Skill[] = this.resourceSignal();
    const skillEvolveChain: Skill[][] = [];
    const processedBaseSkills = new Set<SkillID>();

    skills.forEach((skill: Skill) => {
      if (!skill.evolvedFrom) {
        return;
      }
      // Get the base skill of the current chain
      const baseSkill: Skill = this.getBaseSkill(skill, skills);

      // If we've already processed this base skill's chain, skip it
      if (processedBaseSkills.has(baseSkill.id)) {
        return;
      }

      // Build the complete evolution chain starting from the base skill
      const evolutionChain: Skill[] = this.buildEvolutionChain(baseSkill, skills);

      // Add the chain to our results and mark the base skill as processed
      skillEvolveChain.push(evolutionChain);
      processedBaseSkills.add(baseSkill.id);
    });

    return skillEvolveChain;
  });

  constructor(http: HttpClient) {
    super(http, SKILL_DATA_PATH);
  }

  getSkillsByType(type: SkillType): Skill[] {
    return this.resourceSignal().filter((skill: Skill) => skill.skillType === type);
  }

  getSkillEvolveChainBySkillId(skillId: SkillID): Skill[] {
    return this.skillEvolveChain().find((chain: Skill[]) => chain.map((skill: Skill): SkillID => skill.id).includes(skillId)) || [];
  }

  private getBaseSkill(skill: Skill, allSkills: Skill[]): Skill {
    let currentSkill: Skill = skill;
    while (currentSkill.evolvedFrom) {
      const previousSkill: Skill | undefined = allSkills.find((skill: Skill) => skill.id === currentSkill.evolvedFrom);
      if (!previousSkill) {
        break;
      }
      currentSkill = previousSkill;
    }
    return currentSkill;
  }

  private buildEvolutionChain(baseSkill: Skill, allSkills: Skill[]): Skill[] {
    const chain: Skill[] = [baseSkill];
    let currentSkill: Skill = baseSkill;

    while (chain.length < 6) { // MAX_CHAIN_LENGTH = 6
      const evolvedSkill: Skill | undefined = allSkills.find((skill: Skill) => skill.evolvedFrom === currentSkill.id);
      if (!evolvedSkill) {
        break;
      }
      chain.push(evolvedSkill);
      currentSkill = evolvedSkill;
    }

    return chain;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ItemService extends GenericResourceService<Item> {
  constructor(http: HttpClient) {
    super(http, ITEM_DATA_PATH);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ClassService extends GenericResourceService<Class> {
  constructor(http: HttpClient) {
    super(http, CLASS_DATA_PATH);
  }
}
