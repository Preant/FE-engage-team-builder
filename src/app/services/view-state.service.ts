import { Injectable, signal, WritableSignal } from '@angular/core';

import { ViewType } from '@/app/models/ViewType.enum';

@Injectable({
  providedIn: 'root'
})
export class ViewStateService {
  private currentView: WritableSignal<ViewType> = signal<ViewType>(ViewType.RESOURCES);
  private isResourcesPanelOpen: WritableSignal<boolean> = signal<boolean>(true);
  private selectedCharacterId: WritableSignal<number | null> = signal<number | null>(null);
  private selectedEmblemId: WritableSignal<number | null> = signal<number | null>(null);
  private selectedWeaponId: WritableSignal<number | null> = signal<number | null>(null);
  private selectedSkillId: WritableSignal<number | null> = signal<number | null>(null);

  getCurrentView(): WritableSignal<ViewType> {
    return this.currentView;
  }

  setView(view: ViewType): void {
    this.currentView.set(view);
  }

  getSelectedCharacterId(): WritableSignal<number | null> {
    return this.selectedCharacterId;
  }

  setSelectedCharacterId(id: number | null): void {
    this.selectedCharacterId.set(id);
  }

  getSelectedEmblemId(): WritableSignal<number | null> {
    return this.selectedEmblemId;
  }

  setSelectedEmblemId(id: number | null): void {
    this.selectedEmblemId.set(id);
  }

  getSelectedWeaponId(): WritableSignal<number | null> {
    return this.selectedWeaponId;
  }

  setSelectedWeaponId(id: number | null): void {
    this.selectedWeaponId.set(id);
  }

  getSelectedSkillId(): WritableSignal<number | null> {
    return this.selectedSkillId;
  }

  setSelectedSkillId(id: number | null): void {
    this.selectedSkillId.set(id);
  }

  getIsResourcesPanelOpen(): WritableSignal<boolean> {
    return this.isResourcesPanelOpen;
  }

  setIsResourcesPanelOpen(isOpen: boolean): void {
    this.isResourcesPanelOpen.set(isOpen);
  }

  openPanel(): void {
    if (!this.isResourcesPanelOpen()) {
      this.isResourcesPanelOpen.set(true);
    }
  }

  closePanel(): void {
    if (this.isResourcesPanelOpen()) {
      this.isResourcesPanelOpen.set(false);
    }
  }
}
