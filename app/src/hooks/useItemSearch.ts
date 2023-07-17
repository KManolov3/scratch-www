import { useCallback } from 'react';
import { Item } from 'src/__generated__/graphql';
import { TypedDocumentNode } from '@apollo/client';
import { apolloClient } from '@config/graphql';
import { useAsyncAction } from '@hooks/useAsyncAction';
import { useLatestRef } from '@hooks/useLatestRef';
import { isApolloNoItemResultsError } from '@lib/apollo';
import { useCurrentSessionInfo } from '@services/Auth';

export class NoItemResultsError extends Error {
  originalError: unknown;

  constructor(message: string, originalError: unknown) {
    super(message);
    this.originalError = originalError;
  }
}

type SearchProps = {
  frontTagPrice?: number;
} & ({ sku?: undefined; upc: string } | { sku: string; upc?: undefined });

export interface SearchResult<T> {
  itemDetails?: T;
  frontTagPrice?: number;
  searchType: 'sku' | 'upc';
}

type SkuQueryResult = {
  itemBySku?: Partial<Item> | null;
};
type SkuQuery = TypedDocumentNode<
  {
    __typename?: 'Query';
  } & SkuQueryResult,
  {
    sku: string;
    storeNumber: string;
  }
>;

type UpcQueryResult = {
  itemByUpc?: Partial<Item> | null;
};
type UpcQuery = TypedDocumentNode<
  {
    __typename?: 'Query';
  } & UpcQueryResult,
  {
    upc: string;
    storeNumber: string;
  }
>;

type ItemResult = SkuQueryResult['itemBySku'] | UpcQueryResult['itemByUpc'];
export interface UseItemSearchProps {
  skuQuery: SkuQuery;
  upcQuery: UpcQuery;
  onError?: (error: unknown) => void;
  onComplete?: <T extends ItemResult>(searchResult: SearchResult<T>) => void;
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
    async ({ sku, upc, frontTagPrice }: SearchProps) => {
      if (sku) {
        const skuResult = await apolloClient.query({
          query: skuQuery,
          variables: { sku, storeNumber },
        });

        if (!skuResult.data.itemBySku) {
          throw new Error('Missing item info');
        }

        return {
          itemDetails: skuResult.data.itemBySku,
          frontTagPrice,
          searchType: 'sku' as const,
        };
      }

      if (upc) {
        const upcResult = await apolloClient.query({
          query: upcQuery,
          variables: { upc, storeNumber },
        });

        if (!upcResult.data.itemByUpc) {
          throw new Error('Missing item info');
        }

        return {
          itemDetails: upcResult.data.itemByUpc,
          searchType: 'upc' as const,
        };
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
        if (isApolloNoItemResultsError(searchError)) {
          transformedError = new NoItemResultsError(
            'No results found. Try searching for another SKU or scanning a barcode.',
            searchError,
          );
        }

        onErrorRef.current?.(transformedError);

        throw transformedError;
      }
    },
    {
      globalErrorHandling: searchError =>
        searchError instanceof NoItemResultsError
          ? 'ignored'
          : { displayAs: 'toast' },
    },
  );

  return {
    search,
    loading,
    error,
  };
}
