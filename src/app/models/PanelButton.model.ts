import { ViewType } from '@/app/models/ViewType.enum';

export interface PanelButton {
    name: string;
    viewType: ViewType;
    size: 'large' | 'small';
    color: string;
    gridArea: string;
    textGradient: string;
    content: string[];
    isVideo: boolean;
}
