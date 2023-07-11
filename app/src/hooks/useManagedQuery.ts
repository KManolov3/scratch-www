import { DocumentNode } from 'graphql';
import { useEffect } from 'react';
import {
  OperationVariables,
  TypedDocumentNode,
  LazyQueryHookOptions,
} from '@apollo/client';
import { GlobalErrorHandlingSetting } from '@services/ErrorContext';
import { useManagedLazyQuery } from './useManagedLazyQuery';

/**
 * Provides the same functionality as `useQuery`, but registers requests
 * with the global error handling mechanism.
 * --------------------
 * `useManagedQuery`, is currently implemented using `useManagedLazyQuery`.
 * Which in turn is implemented using `useLazyQuery`.
 * Which in turn is implemented using `useQuery`.
 * Why, you might ask, go through three levels of indirection, instead of just wrapping
 * useQuery?
 * Short answer: It's easier that way
 * Long answer: Unfortunately, in order to shim the query operation, we need to do it
 * after the callback is constructed, and before it is executed. Both of which happen
 * inside the internal state of `useQuery`. So, we either need to access the internal
 * state or implement it ourselves. Both of which require some additional time commitment.
 * The disadvantage of this approach is that we only execute the request once, and so can't
 * use some of the properties which retry the query - for example polling -
 * https://www.apollographql.com/docs/react/data/queries/#polling
 * Do change this, if we ever need to support such behaviour.
 * */
export function useManagedQuery<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: LazyQueryHookOptions<TData, TVariables> & {
    globalErrorHandling: GlobalErrorHandlingSetting;
  },
) {
  const { trigger, loading, error, data } = useManagedLazyQuery(query, options);

  useEffect(() => {
    trigger();
    // Intentionally keeping the dependency array empty, this should only execute on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    loading,
    error,
    data,
  };
}
