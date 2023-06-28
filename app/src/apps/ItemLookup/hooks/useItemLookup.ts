import { useCallback, useMemo } from 'react';
import { gql } from 'src/__generated__';
import { ApolloError, useLazyQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { useCurrentSessionInfo } from '@services/Auth';
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

type SearchProps = {
  frontTagPrice?: number;
} & ({ sku?: undefined; upc: string } | { sku: string; upc?: undefined });

export interface useItemLookupProps {
  onError?: (error: ApolloError) => void;
  onComplete?: () => void;
}

export function useItemLookup({
  onError,
  onComplete,
}: useItemLookupProps = {}) {
  const { navigate } = useNavigation<ItemLookupNavigation>();
  const { storeNumber } = useCurrentSessionInfo();

  const [searchBySku, { loading: isLoadingItemBySku, error: skuError }] =
    useLazyQuery(ITEM_BY_SKU);

  const [searchByUpc, { loading: isLoadingItemByUpc, error: upcError }] =
    useLazyQuery(ITEM_BY_UPC);

  const loading = useMemo(
    () => isLoadingItemBySku && isLoadingItemByUpc,
    [isLoadingItemBySku, isLoadingItemByUpc],
  );
  const error = useMemo(() => skuError ?? upcError, [skuError, upcError]);

  const search = useCallback(
    ({ sku, upc, frontTagPrice }: SearchProps) => {
      if (sku) {
        return searchBySku({
          variables: { sku, storeNumber },
          onError,
          onCompleted: itemDetails => {
            if (itemDetails.itemBySku) {
              onComplete?.();
              navigate('ItemLookup', {
                itemDetails: itemDetails.itemBySku,
                frontTagPrice,
              });
            }
          },
        });
      }
      if (upc) {
        return searchByUpc({
          variables: { upc, storeNumber },
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
      }
    },
    [navigate, onComplete, onError, searchBySku, searchByUpc, storeNumber],
  );

  return { search, loading, error };
}
