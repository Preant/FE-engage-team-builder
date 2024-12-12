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

export function isItem(obj: unknown): obj is Item {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  return 'id' in obj &&
        'name' in obj &&
        'uses' in obj &&
        'hit' in obj &&
        'range' in obj &&
        'type' in obj &&
        'rank' in obj &&
        'price' in obj &&
        'description' in obj &&
        'isEngageItem' in obj;
}
