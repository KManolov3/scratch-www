import { useCallback, useMemo, useRef } from 'react';
import { gql } from 'src/__generated__';
import { ApolloError } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { useCurrentSessionInfo } from '@services/Auth';
import { useManagedLazyQuery } from '@hooks/useManagedLazyQuery';
import { BehaviourOnFailure } from '@services/ErrorState/types';
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

export interface UseItemLookupProps {
  onError?: (error: ApolloError) => void;
  onComplete?: () => void;
}

export function useItemLookup({
  onError,
  onComplete,
}: UseItemLookupProps = {}) {
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const { navigate } = useNavigation<ItemLookupNavigation>();
  const { storeNumber } = useCurrentSessionInfo();

  const {
    perform: searchBySku,
    loading: isLoadingItemBySku,
    error: skuError,
  } = useManagedLazyQuery(ITEM_BY_SKU, {
    // TODO: Should we use interceptError for such side effects as well?
    onError,
    globalErrorHandling: {
      interceptError: () => ({
        behaviourOnFailure: BehaviourOnFailure.Toast,
      }),
    },
  });
  const {
    perform: searchByUpc,
    loading: isLoadingItemByUpc,
    error: upcError,
  } = useManagedLazyQuery(ITEM_BY_UPC, {
    onError,
    globalErrorHandling: {
      interceptError: () => ({
        behaviourOnFailure: BehaviourOnFailure.Toast,
      }),
    },
  });

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
          onError: onErrorRef.current,
          onCompleted: itemDetails => {
            if (itemDetails.itemBySku) {
              onCompleteRef.current?.();
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
          onError: onErrorRef.current,
          onCompleted: itemDetails => {
            if (itemDetails.itemByUpc) {
              onCompleteRef.current?.();
              navigate('ItemLookup', {
                itemDetails: itemDetails.itemByUpc,
              });
            }
          },
        });
      }
    },
    [navigate, searchBySku, searchByUpc, storeNumber],
  );

  return { search, loading, error };
}
