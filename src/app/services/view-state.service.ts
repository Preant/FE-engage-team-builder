import { Injectable, signal, WritableSignal } from '@angular/core';

import { ViewType } from '@/app/models/ViewType.enum';

@Injectable({
  providedIn: 'root'
})
export class ViewStateService {
  private currentView: WritableSignal<ViewType> = signal<ViewType>(ViewType.RESOURCES);
  private selectedCharacterId: WritableSignal<number | null> = signal<number | null>(null);

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
}
