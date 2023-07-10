import { noop } from 'lodash-es';
import { useCallback, useMemo, useRef } from 'react';
import { gql } from 'src/__generated__';
import { useManagedLazyQuery } from '@hooks/useManagedLazyQuery';
import { isApolloNotFoundError } from '@lib/apollo';
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
  isNotFoundError: boolean;
};

export interface UseItemLookupProps {
  onError?: (error: unknown, isNotFoundError: boolean) => void;
  onComplete?: () => void;
}

export function useItemLookup({
  onError = noop,
  onComplete,
}: UseItemLookupProps = {}) {
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const { navigate } = useNavigation<ItemLookupNavigation>();
  const { storeNumber } = useCurrentSessionInfo();

  const {
    trigger: searchBySku,
    loading: isLoadingItemBySku,
    error: skuError,
  } = useManagedLazyQuery(ITEM_BY_SKU, {
    globalErrorHandling: error => {
      const isNotFoundError = isApolloNotFoundError(searchError);
      onErrorRef.current(error, isNotFoundError);
      if (isNotFoundError) {
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
      const isNotFoundError = isApolloNotFoundError(error);
      onErrorRef.current(error, isNotFoundError);
      if (isNotFoundError) {
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
      isNotFoundError: isApolloNotFoundError(error),
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
    [navigate, searchBySku, searchByUpc, storeNumber],
  );

  return {
    search,
    loading,
    error: searchError,
  };
}
