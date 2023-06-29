import {
  OperationVariables,
  TypedDocumentNode,
  QueryHookOptions,
} from '@apollo/client';
import { GlobalErrorHandlingSetting } from '@services/ErrorState/types';
import { DocumentNode } from 'graphql';
import { useEffect } from 'react';
import { useManagedLazyQuery } from './useManagedLazyQuery';

/**
 * A wrapper on `useQuery`, which allows for requests
 * to be registered with the global error handling.
 * */
export function useManagedQuery<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: QueryHookOptions<TData, TVariables> & {
    globalErrorHandling: GlobalErrorHandlingSetting;
  },
) {
  const { perform, loading, error, data } = useManagedLazyQuery(query, options);

  // TODO: !Find out if perform is a stable reference
  useEffect(() => {
    perform();
  }, [perform]);

  return {
    loading,
    error,
    data,
  };
}
