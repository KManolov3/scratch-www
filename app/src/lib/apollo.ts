import { ApolloError } from '@apollo/client';

export function isApolloNoResultsError(error: unknown) {
  return !!(
    error instanceof ApolloError &&
    (error.graphQLErrors[0]?.extensions.errorType === 'NOT_FOUND' ||
      error.graphQLErrors[0]?.message.endsWith(
        'should only contain digits 0-9',
      ) ||
      error.graphQLErrors[0]?.message.endsWith(
        'SKU value should be of length between 1 and 9',
      ))
  );
}
