import { PanelButton } from './PanelButton.model';

export interface PanelGridConfig {
    buttons: PanelButton[];
    cols: number;
    rows: number;
    waitDurationBetweenVideoCycles: number;
}

export const DEFAULT_PANEL_GRID_CONFIG: PanelGridConfig = {
  buttons: [],
  cols: 3,
  rows: 2,
  waitDurationBetweenVideoCycles: 3500
};

/**
 * Creates a PanelGridConfig by merging partial config with default values
 * @param config - Partial configuration to merge with defaults
 * @returns Complete PanelGridConfig with all required fields
 */
export function createPanelGridConfig(config: Partial<PanelGridConfig> = {}): PanelGridConfig {
  return {
    ...DEFAULT_PANEL_GRID_CONFIG,
    ...config
  };
}
