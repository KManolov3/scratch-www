import { gql } from 'src/__generated__/gql';
import { SearchResult, useItemSearch } from '@hooks/useItemSearch';
import { useNavigation } from '@react-navigation/native';
import { ItemLookupNavigation } from '../navigator';

const ITEM_BY_SKU = gql(`
query ManualItemLookup($sku: String!, $storeNumber: String!) {
  itemBySku(sku: $sku, storeNumber: $storeNumber) {
    ...ItemInfoHeaderFields
    ...PlanogramFields
    ...BackstockSlotFields
  },
}
`);

const ITEM_BY_UPC = gql(`
query AutomaticItemLookup($upc: String!, $storeNumber: String!) {
  itemByUpc(upc: $upc, storeNumber: $storeNumber) {
    ...ItemInfoHeaderFields
    ...PlanogramFields
    ...BackstockSlotFields
  },
}
`);

export interface UseItemLookupProps {
  onError?: (error: unknown) => void;
  onComplete?: <T>(searchResult: SearchResult<T>) => void;
}

export function useItemLookup({
  onError,
  onComplete,
}: UseItemLookupProps = {}) {
  const { navigate } = useNavigation<ItemLookupNavigation>();

  return useItemSearch({
    onError,
    onComplete: searchResult => {
      onComplete?.(searchResult);
      if (searchResult.itemDetails) {
        navigate('ItemLookup', {
          itemDetails: searchResult.itemDetails,
          frontTagPrice: searchResult.frontTagPrice,
        });
      }
    },
    skuQuery: ITEM_BY_SKU,
    upcQuery: ITEM_BY_UPC,
  });
}
