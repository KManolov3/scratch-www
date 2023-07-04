import { DocumentNode } from 'graphql';
import {
  OperationVariables,
  TypedDocumentNode,
  LazyQueryHookOptions,
  useLazyQuery,
} from '@apollo/client';
import { useErrorManager } from '@services/ErrorState/';
import { GlobalErrorHandlingSetting } from '@services/ErrorState/types';

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
  const { executeAndHandleErrors } = useErrorManager();

  const [execute, { loading, error, data }] = useLazyQuery(query, options);

  let shimmedExecute = execute;
  if (options.globalErrorHandling !== 'disabled') {
    const { interceptError } = options.globalErrorHandling;
    shimmedExecute = () =>
      executeAndHandleErrors(async (...args) => {
        const result = await execute(...args);
        if (result.error) {
          throw result.error;
        }

        return result;
      }, interceptError);
  }

  return {
    perform: shimmedExecute,
    loading,
    error,
    data,
  };
}
