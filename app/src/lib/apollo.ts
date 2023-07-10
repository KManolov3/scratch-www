import { ApolloError } from '@apollo/client';

export function isApolloNotFoundError(error: unknown) {
  if (
    error instanceof ApolloError &&
    error.graphQLErrors[0]?.extensions.errorType === 'NOT_FOUND'
  ) {
    return true;
  }
  return false;
}
