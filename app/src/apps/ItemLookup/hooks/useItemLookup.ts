import { gql } from 'src/__generated__';
import { NoResultsError } from 'src/errors/NoResultsError';
import { GlobalStateItemDetails } from '@apps/state';
import { apolloClient } from '@config/graphql';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useLatestRef } from '@hooks/useLatestRef';
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

export interface UseItemLookupProps {
  onError?: (error: unknown) => void;
  onComplete?: () => void;
}

export function useItemLookup({
  onError,
  onComplete,
}: UseItemLookupProps = {}) {
  const onErrorRef = useLatestRef(onError);
  const onCompleteRef = useLatestRef(onComplete);

  const { navigate } = useNavigation<ItemLookupNavigation>();
  const { storeNumber } = useCurrentSessionInfo();

  const {
    trigger: search,
    loading,
    error,
  } = useAsyncAction(
    async ({ sku, upc, frontTagPrice }: SearchProps) => {
      let searchResult: {
        itemDetails?: GlobalStateItemDetails;
        frontTagPrice?: number;
      } = {};
      let searchError: unknown;

      if (sku) {
        try {
          const skuResult = await apolloClient.query({
            query: ITEM_BY_SKU,
            variables: { sku, storeNumber },
          });

          // eslint-disable-next-line max-depth
          if (skuResult.data.itemBySku) {
            searchResult = {
              itemDetails: skuResult.data.itemBySku,
            };
          }
        } catch (e) {
          searchError = e;
        }
      }

      if (upc) {
        try {
          const upcResult = await apolloClient.query({
            query: ITEM_BY_UPC,
            variables: { upc, storeNumber },
          });

          // eslint-disable-next-line max-depth
          if (upcResult.data.itemByUpc) {
            searchResult = {
              itemDetails: upcResult.data.itemByUpc,
              frontTagPrice,
            };
          }
        } catch (e) {
          searchError = e;
        }
      }

      if (searchError) {
        let transformedError = searchError;
        if (isApolloNoResultsError(searchError)) {
          transformedError = new NoResultsError(
            'No results found. Try searching for another SKU or scanning a barcode.',
            searchError,
          );
        }

        onErrorRef.current?.(transformedError);

        throw transformedError;
      }

      onCompleteRef.current?.();
      if (searchResult.itemDetails) {
        navigate('ItemLookup', {
          itemDetails: searchResult.itemDetails,
          frontTagPrice: searchResult.frontTagPrice,
        });
      }

      return searchResult;
    },
    {
      globalErrorHandling: searchError => {
        const isNoResultsError = searchError instanceof NoResultsError;
        if (isNoResultsError) {
          return 'ignored';
        }
        return {
          displayAs: 'toast',
        };
      },
    },
  );

  return {
    search,
    loading,
    error,
  };
}
