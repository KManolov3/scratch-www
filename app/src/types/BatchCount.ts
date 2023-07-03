import { Item } from 'src/__generated__/graphql';

export interface BatchCountItem {
  item: Item & { sku: NonNullable<Item['sku']> };
  newQty: number;
  isBookmarked?: boolean;
}
