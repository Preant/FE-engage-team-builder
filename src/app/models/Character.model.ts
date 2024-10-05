import { StatSheet } from "./StatSheet.model";

export type Character = {
    id: number;
    name: string;
    growth: StatSheet;
    base: StatSheet;
    resourceIdentifier: string;
}
