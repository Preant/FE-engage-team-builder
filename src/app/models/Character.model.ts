import { Country } from './Country.enum';
import { StatSheet } from './StatSheet.model';

export type Character = {
    id: number;
    name: string;
    country: Country;
    growth: StatSheet;
    base: StatSheet;
    resourceIdentifier: string;
}
