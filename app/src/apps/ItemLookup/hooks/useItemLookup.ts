import { useMemo } from 'react';
import { gql } from 'src/__generated__';
import { ApolloError, useLazyQuery } from '@apollo/client';
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

interface useItemLookupProps {
  onError?: (error: ApolloError) => void;
  onComplete?: () => void;
}

export function useItemLookup({
  onError,
  onComplete,
}: useItemLookupProps = {}) {
  const { navigate } = useNavigation<ItemLookupNavigation>();

  const [searchBySku, { loading: isLoadingItemBySku, error: skuError }] =
    useLazyQuery(ITEM_BY_SKU, {
      onError,
      onCompleted: itemDetails => {
        if (itemDetails.itemBySku) {
          onComplete?.();
          navigate('ItemLookup', {
            itemDetails: itemDetails.itemBySku,
          });
        }
      },
    });

  const [searchByUpc, { loading: isLoadingItemByUpc, error: upcError }] =
    useLazyQuery(ITEM_BY_UPC, {
      onError,
      onCompleted: itemDetails => {
        if (itemDetails.itemByUpc) {
          onComplete?.();
          navigate('ItemLookup', {
            itemDetails: itemDetails.itemByUpc,
          });
        }
      },
    });

  const loading = useMemo(
    () => isLoadingItemBySku && isLoadingItemByUpc,
    [isLoadingItemBySku, isLoadingItemByUpc],
  );
  const error = useMemo(() => skuError ?? upcError, [skuError, upcError]);

  return { searchBySku, searchByUpc, loading, error };
}
