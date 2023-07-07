import { DocumentNode } from 'graphql';
import { useCallback } from 'react';
import {
  OperationVariables,
  TypedDocumentNode,
  LazyQueryHookOptions, // eslint-disable-next-line no-restricted-syntax
  useLazyQuery,
} from '@apollo/client';
import {
  GlobalErrorHandlingSetting,
  useErrorManager,
} from '@services/ErrorContext';

/**
 * A wrapper on `useLazyQuery`, which allows for requests
 * to be registered with the global error handling.
 * */
export function useManagedLazyQuery<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: LazyQueryHookOptions<TData, TVariables> & {
    globalErrorHandling: GlobalErrorHandlingSetting;
  },
) {
  const { executeWithGlobalErrorHandling } = useErrorManager();

  const [execute, { loading, error, data }] = useLazyQuery(query, options);

  const shimmedExecute = useCallback(
    (additionalOptions?: Partial<LazyQueryHookOptions<TData, TVariables>>) => {
      if (options.globalErrorHandling === 'disabled') {
        return execute(additionalOptions);
      }

      return executeWithGlobalErrorHandling(async () => {
        const result = await execute(additionalOptions);
        if (result.error) {
          throw result.error;
        }

        return result;
      }, options.globalErrorHandling);
    },
    [execute, executeWithGlobalErrorHandling, options],
  );

  return {
    perform: shimmedExecute,
    loading,
    error,
    data,
  };
}
