import { StatSheet } from "./StatSheet.model";

export type Character = {
    id: number;
    name: string;
    image: string;
    growth: StatSheet;
    base: StatSheet;
}
