import { DocumentNode } from 'graphql';
import { merge } from 'lodash-es';
import { useCallback } from 'react';
import {
  OperationVariables,
  TypedDocumentNode,
  LazyQueryHookOptions,
  useLazyQuery,
} from '@apollo/client';
import {
  GlobalErrorHandlingSetting,
  useErrorManager,
} from '@services/ErrorState';

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
    (
      additionalOptions?:
        | Partial<
            LazyQueryHookOptions<TData, TVariables> & {
              globalErrorHandling: GlobalErrorHandlingSetting;
            }
          >
        | undefined,
    ) => {
      const execOptions = merge(options, additionalOptions);
      if (execOptions.globalErrorHandling === 'disabled') {
        return execute(execOptions);
      }

      const { interceptError } = execOptions.globalErrorHandling;
      return executeWithGlobalErrorHandling(async () => {
        const result = await execute(execOptions);
        if (result.error) {
          throw result.error;
        }

        return result;
      }, interceptError);
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
