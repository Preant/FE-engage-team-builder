import { CommonModule } from '@angular/common';
import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';

import { TeamMemberCardComponent } from './team-member-card.component';

import { Character } from '@/app/models/Character.model';
import { Emblem } from '@/app/models/Emblem.model';
import { ImageSize } from '@/app/models/ImageSize.enum';
import { AssetsService } from '@/app/services/assets.service';
import { CharacterService } from '@/app/services/character.service';
import { EmblemService } from '@/app/services/emblem.service';

type TeamMember = {
    id: number;
    character: Character | null;
    emblem: Emblem | null;
    weapons: (string | null)[];
}

@Component({
  selector: 'app-team-builder',
  standalone: true,
  imports: [CommonModule, TeamMemberCardComponent],
  template: `
        <div class="h-full bg-gradient-to-br from-rich_black-400/50 to-gunmetal-500/50 p-4 space-y-4 overflow-y-auto">
            <h2 class="text-2xl font-bold text-baby_powder-500 mb-6">Team Builder</h2>

            @for (member of teamMembers(); track member.id) {
                <app-team-member-card
                        [character]="member.character"
                        [emblem]="member.emblem"
                        [weapons]="member.weapons"
                        [availableCharacters]="getAvailableCharacterItems()"
                        [availableEmblems]="getAvailableEmblemItems()"
                        [showCharacterSelection]="isSelectingCharacter() === member.id"
                        [showEmblemSelection]="isSelectingEmblem() === member.id"
                        (characterClick)="openCharacterSelection(member.id)"
                        (emblemClick)="openEmblemSelection(member.id)"
                        (characterSelect)="selectCharacter($event, member.id)"
                        (emblemSelect)="selectEmblem($event, member.id)"
                />
            }
        </div>
    `,
  styles: [`
        :host {
            display: block;
            height: 100%;
        }
    `]
})
export class TeamBuilderComponent {
  private assetsService = inject(AssetsService);
  private characterService = inject(CharacterService);
  private emblemService = inject(EmblemService);

  private teamMembersSignal: WritableSignal<TeamMember[]> = signal([
    { id: 1, character: null, emblem: null, weapons: [null, null, null, null] },
    { id: 2, character: null, emblem: null, weapons: [null, null, null, null] },
    { id: 3, character: null, emblem: null, weapons: [null, null, null, null] },
    { id: 4, character: null, emblem: null, weapons: [null, null, null, null] }
  ]);
  teamMembers: Signal<TeamMember[]> = this.teamMembersSignal.asReadonly();
  private selectingCharacterId: WritableSignal<number | null> = signal(null);
  isSelectingCharacter: Signal<number | null> = this.selectingCharacterId.asReadonly();
  private selectingEmblemId: WritableSignal<number | null> = signal(null);
  isSelectingEmblem: Signal<number | null> = this.selectingEmblemId.asReadonly();

  getAvailableCharacterItems() {
    const usedCharacters = new Set(
      this.teamMembers()
        .filter(member => member.character)
        .map(member => member.character!.id)
    );

    return this.characterService.getCharacters()()
      .filter(char => !usedCharacters.has(char.id))
      .map(char => ({
        id: char.id,
        label: char.name,
        imageUrl: this.assetsService.getCharacterImage(char.identifier, ImageSize.SMALL)
      }));
  }

  getAvailableEmblemItems() {
    const usedEmblems = new Set(
      this.teamMembers()
        .filter(member => member.emblem)
        .map(member => member.emblem!.id)
    );

    return this.emblemService.getEmblems()()
      .filter(emb => !usedEmblems.has(emb.id))
      .map(emb => ({
        id: emb.id,
        label: emb.name,
        imageUrl: this.assetsService.getEmblemImage(emb.resourceIdentifier, ImageSize.SMALL)
      }));
  }

  openCharacterSelection(memberId: number): void {
    this.selectingCharacterId.set(memberId);
    this.selectingEmblemId.set(null);
  }

  openEmblemSelection(memberId: number): void {
    this.selectingEmblemId.set(memberId);
    this.selectingCharacterId.set(null);
  }

  selectCharacter(characterId: number, memberId: number): void {
    const character = this.characterService.getCharacters()().find(char => char.id === characterId);
    if (character) {
      this.teamMembersSignal.update(members =>
        members.map(member =>
          member.id === memberId
            ? { ...member, character }
            : member
        )
      );
    }
    this.selectingCharacterId.set(null);
  }

  selectEmblem(emblemId: number, memberId: number): void {
    const emblem = this.emblemService.getEmblems()().find(emb => emb.id === emblemId);
    if (emblem) {
      this.teamMembersSignal.update(members =>
        members.map(member =>
          member.id === memberId
            ? { ...member, emblem }
            : member
        )
      );
    }
    this.selectingEmblemId.set(null);
  }
}
