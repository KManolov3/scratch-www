import { DocumentNode } from 'graphql';
import {
  DefaultContext,
  ApolloCache,
  OperationVariables,
  TypedDocumentNode,
  MutationHookOptions,
  useApolloClient,
  ApolloError,
  MutationFunctionOptions,
} from '@apollo/client';
import { GlobalErrorHandlingSetting } from '@services/ErrorState/types';
import { useAsyncAction } from './useAsyncAction';

/**
 * Recreates the base functionality of `useMutation` using `useAsyncAction` instead.
 * Allows connecting the passed mutation to the global error handling.
 * */
export function useManagedMutation<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData = any,
>(
  mutation: DocumentNode | TypedDocumentNode<TData, OperationVariables>,
  options: MutationHookOptions<
    TData,
    OperationVariables,
    DefaultContext,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ApolloCache<any>
  > & {
    globalErrorHandling: GlobalErrorHandlingSetting;
  },
) {
  const client = useApolloClient(options && options.client);

  // TODO: Do we shim `useMutation` instead (as in `useManagedQuery`),
  // to be able to access other errors set automatically by Apollo
  const { perform, trigger, data, error, loading } = useAsyncAction(
    async (
      args: MutationFunctionOptions<
        TData,
        OperationVariables,
        DefaultContext,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ApolloCache<any>
      >,
    ) => {
      const res = await client.mutate({ ...options, ...args, mutation });

      if (res.errors && res.errors.length > 0) {
        throw new ApolloError({ graphQLErrors: res.errors });
      }

      return res.data;
    },
    { globalErrorHandling: options.globalErrorHandling },
  );

  return {
    trigger,
    perform,
    data,
    error,
    loading,
  };
}
