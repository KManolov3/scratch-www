import { ApolloError } from '@apollo/client';

export function isApolloNoResultsError(error: unknown) {
  if (
    error instanceof ApolloError &&
    (error.graphQLErrors[0]?.extensions.errorType === 'NOT_FOUND' ||
      error.graphQLErrors[0]?.message.endsWith(
        'should only contain digits 0-9',
      ))
  ) {
    return true;
  }
  return false;
}
