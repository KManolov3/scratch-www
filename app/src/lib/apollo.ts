import { ApolloError } from '@apollo/client';

const lengthRegex = /(SKU|UPC) value should be of length between/;
const digitsRegex = /(SKU|UPC) should only contain digits/;

export function isApolloNoResultsError(error: unknown) {
  return !!(
    error instanceof ApolloError &&
    (error.graphQLErrors[0]?.extensions.errorType === 'NOT_FOUND' ||
      error.graphQLErrors[0]?.message.match(digitsRegex) ||
      error.graphQLErrors[0]?.message.match(lengthRegex))
  );
}
