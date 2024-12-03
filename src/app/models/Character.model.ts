import { Country } from './Country.enum';
import { StatSheet } from './StatSheet.model';

export type Character = {
    id: number;
    identifier: string;
    name: string;
    country: Country;
    growth: StatSheet;
    base: StatSheet;
}
