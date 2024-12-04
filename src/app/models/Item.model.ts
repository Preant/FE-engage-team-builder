import { ItemType } from '@/app/models/ItemType.enum';

export type Item = {
    id: number;
    identifier: string;
    name: string;
    uses: number | 'inf';
    hit: number | 'inf';
    range: [number, number];
    type: ItemType;
    rank: string;
    price: number;
    description: string;
    isEngageItem: boolean
}
