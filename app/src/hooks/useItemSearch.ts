import { useCallback } from 'react';
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
  searchType: 'sku' | 'upc';
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

  const searchBy = useCallback(
    async ({ sku, upc, frontTagPrice }: SearchProps): Promise<SearchResult> => {
      if (sku) {
        const skuResult = await apolloClient.query({
          query: skuQuery,
          variables: { sku, storeNumber },
        });

        if (skuResult.data.itemBySku) {
          return {
            itemDetails: skuResult.data.itemBySku,
            searchType: 'sku',
          };
        }
      }

      if (upc) {
        const upcResult = await apolloClient.query({
          query: upcQuery,
          variables: { upc, storeNumber },
        });

        if (upcResult.data.itemByUpc) {
          return {
            itemDetails: upcResult.data.itemByUpc,
            frontTagPrice,
            searchType: 'upc',
          };
        }
      }

      throw new Error('Unsupported search type. This should not happen.');
    },
    [skuQuery, storeNumber, upcQuery],
  );

  const {
    trigger: search,
    loading,
    error,
  } = useAsyncAction(
    async (searchProps: SearchProps) => {
      try {
        const searchResult = await searchBy(searchProps);

        onCompleteRef.current?.(searchResult);

        return searchResult;
      } catch (searchError) {
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
