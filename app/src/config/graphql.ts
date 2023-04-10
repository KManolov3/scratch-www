import { ApolloClient, InMemoryCache } from '@apollo/client';
import { config } from '../config';

export const apolloClient = new ApolloClient({
  uri: config.apiUrl,
  cache: new InMemoryCache(),
});
