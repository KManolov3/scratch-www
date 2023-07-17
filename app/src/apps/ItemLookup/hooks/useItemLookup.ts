import { gql } from 'src/__generated__/gql';
import { ResultOf } from '@graphql-typed-document-node/core';
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

type SearchResultType = SearchResult<
  | ResultOf<typeof ITEM_BY_SKU>['itemBySku']
  | ResultOf<typeof ITEM_BY_UPC>['itemByUpc']
>;
export interface UseItemLookupProps {
  onError?: (error: unknown) => void;
  onComplete?: (searchResult: SearchResultType) => void;
}

export function useItemLookup({
  onError,
  onComplete,
}: UseItemLookupProps = {}) {
  const { navigate } = useNavigation<ItemLookupNavigation>();

  return useItemSearch({
    onError,
    onComplete: (searchResult: SearchResultType) => {
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
