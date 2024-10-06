import { StatSheet } from "./StatSheet.model";
import { Country } from "./Country.enum";

export type Character = {
    id: number;
    name: string;
    country: Country;
    growth: StatSheet;
    base: StatSheet;
    resourceIdentifier: string;
}
