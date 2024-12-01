export interface PanelButton {
    name: string;
    link: string;
    size: 'large' | 'small';
    color: string;
    gridArea: string;
    textGradient: string;
    content: string[];
    isVideo: boolean;
}
