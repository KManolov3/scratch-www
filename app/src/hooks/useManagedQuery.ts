import { DocumentNode } from 'graphql';
import { useEffect } from 'react';
import {
  OperationVariables,
  TypedDocumentNode,
  QueryHookOptions,
} from '@apollo/client';
import { GlobalErrorHandlingSetting } from '@services/ErrorState';
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

  useEffect(() => {
    perform();
    // Intentionally keeping the dependency array empty, this should only execute on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    error,
    data,
  };
}
