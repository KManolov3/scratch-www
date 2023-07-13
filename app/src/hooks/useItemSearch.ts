import { Exact, Item } from 'src/__generated__/graphql';
import { NoResultsError } from 'src/errors/NoResultsError';
import { TypedDocumentNode } from '@apollo/client';
import { GlobalStateItemDetails } from '@apps/state';
import { apolloClient } from '@config/graphql';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useLatestRef } from '@hooks/useLatestRef';
import { isApolloNoResultsError } from '@lib/apollo';
import { useCurrentSessionInfo } from '@services/Auth';

type SearchProps = {
  frontTagPrice?: number;
} & ({ sku?: undefined; upc: string } | { sku: string; upc?: undefined });

export interface SearchResult {
  itemDetails?: GlobalStateItemDetails;
  frontTagPrice?: number;
}

export interface UseItemSearchProps {
  onError?: (error: unknown) => void;
  onComplete?: (searchResult: SearchResult) => void;
  skuQuery: TypedDocumentNode<
    {
      __typename?: 'Query';
      itemBySku?: Partial<Item> | null;
    },
    Exact<{
      sku: string;
      storeNumber: string;
    }>
  >;
  upcQuery: TypedDocumentNode<
    {
      __typename?: 'Query';
      itemByUpc?: Partial<Item> | null;
    },
    Exact<{
      upc: string;
      storeNumber: string;
    }>
  >;
}

export function useItemSearch({
  onError,
  onComplete,
  skuQuery,
  upcQuery,
}: UseItemSearchProps) {
  const onErrorRef = useLatestRef(onError);
  const onCompleteRef = useLatestRef(onComplete);

  const { storeNumber } = useCurrentSessionInfo();

  const {
    trigger: search,
    loading,
    error,
  } = useAsyncAction(
    async ({ sku, upc, frontTagPrice }: SearchProps) => {
      let searchResult: SearchResult = {};
      let searchError: unknown;

      if (sku) {
        try {
          const skuResult = await apolloClient.query({
            query: skuQuery,
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
            query: upcQuery,
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

      onCompleteRef.current?.(searchResult);

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
