import { noop } from 'lodash-es';
import { useCallback, useMemo } from 'react';
import { gql } from 'src/__generated__';
import { useLatestRef } from '@hooks/useLatestRef';
import { useManagedLazyQuery } from '@hooks/useManagedLazyQuery';
import { isApolloNoResultsError } from '@lib/apollo';
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

export type SearchError = {
  error: unknown;
  isNoResultsError: boolean;
};

export interface UseItemLookupProps {
  onError?: (error: unknown, isNoResultsError: boolean) => void;
  onComplete?: () => void;
}

export function useItemLookup({
  onError = noop,
  onComplete,
}: UseItemLookupProps = {}) {
  const onErrorRef = useLatestRef(onError);
  const onCompleteRef = useLatestRef(onComplete);

  const { navigate } = useNavigation<ItemLookupNavigation>();
  const { storeNumber } = useCurrentSessionInfo();

  const {
    trigger: searchBySku,
    loading: isLoadingItemBySku,
    error: skuError,
  } = useManagedLazyQuery(ITEM_BY_SKU, {
    globalErrorHandling: error => {
      const isNoResultsError = isApolloNoResultsError(error);
      onErrorRef.current(error, isNoResultsError);
      if (isNoResultsError) {
        return 'ignored';
      }
      return {
        displayAs: 'toast',
      };
    },
  });

  const {
    trigger: searchByUpc,
    loading: isLoadingItemByUpc,
    error: upcError,
  } = useManagedLazyQuery(ITEM_BY_UPC, {
    globalErrorHandling: error => {
      const isNoResultsError = isApolloNoResultsError(error);
      onErrorRef.current(error, isNoResultsError);
      if (isNoResultsError) {
        return 'ignored';
      }
      return {
        displayAs: 'toast',
      };
    },
  });

  const loading = useMemo(
    () => isLoadingItemBySku && isLoadingItemByUpc,
    [isLoadingItemBySku, isLoadingItemByUpc],
  );

  const searchError = useMemo<SearchError | undefined>(() => {
    const error = skuError ?? upcError;

    if (!error) {
      return undefined;
    }

    return {
      error,
      isNoResultsError: isApolloNoResultsError(error),
    };
  }, [skuError, upcError]);

  const search = useCallback(
    ({ sku, upc, frontTagPrice }: SearchProps) => {
      if (sku) {
        return searchBySku({
          variables: { sku, storeNumber },
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
    [navigate, onCompleteRef, searchBySku, searchByUpc, storeNumber],
  );

  return {
    search,
    loading,
    error: searchError,
  };
}
