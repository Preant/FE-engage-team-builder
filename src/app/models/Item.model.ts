import { ItemID } from '@/app/brands/ResourceID.brand';
import { ItemType } from '@/app/models/ItemType.enum';
import { Resource } from '@/app/models/Resource.model';

export type Item = Resource & {
    id: ItemID;
    uses: number | 'inf';
    hit: number | 'inf';
    range: [number, number];
    type: ItemType;
    rank: string;
    price: number;
    description: string;
    isEngageItem: boolean
}
