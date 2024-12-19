import { WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { ViewType } from '@/app/models/ViewType.enum';
import { ViewStateService } from '@/app/services/view-state.service';

describe('ViewStateService', () => {
  const setup = () =>
    TestBed.configureTestingModule({
      providers: []
    }).inject(ViewStateService);

  describe('getCurrentView', () => {
    it('should return a signal with the current view', () => {
      const viewStateService: ViewStateService = setup();
      expect(viewStateService.getCurrentView()).toBeDefined();
      expect(viewStateService.getCurrentView()()).toBe(ViewType.RESOURCES);
    });

    it('should return a signal that can be updated', () => {
      const viewStateService: ViewStateService = setup();
      const currentView: WritableSignal<ViewType> = viewStateService.getCurrentView();
      currentView.set(ViewType.CHARACTERS);
      expect(currentView()).toBe(ViewType.CHARACTERS);
    });
  });
});
