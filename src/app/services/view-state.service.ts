import { Injectable, signal, WritableSignal } from '@angular/core';

import { ViewType } from '@/app/models/ViewType.enum';


@Injectable({
  providedIn: 'root'
})
export class ViewStateService {
  private currentView: WritableSignal<ViewType> = signal<ViewType>(ViewType.RESOURCES);

  getCurrentView(): WritableSignal<ViewType> {
    return this.currentView;
  }

  setView(view: ViewType): void {
    this.currentView.set(view);
  }
}
