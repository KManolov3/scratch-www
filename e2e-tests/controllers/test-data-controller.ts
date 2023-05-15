import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core/index.js';
import { Product } from '../models/product-model.ts';
import * as dotenv from 'dotenv';

dotenv.config();

export class TestDataController {
  private cache = new InMemoryCache();
  private graphqlClient = new ApolloClient({
    // Provide required constructor fields
    cache: this.cache,

    uri: process.env.APOLLO_CLIENT_URI,

    // Provide some optional constructor fields
    name: 'test-client',
    queryDeduplication: false,
    defaultOptions: {},
  });

  // TODO:
  // use generated type from graphql for the "input" parameter
  async setData(input: { items: Product[]; storeNumber: string }) {
    return await this.graphqlClient.mutate({
      mutation: gql(`
        mutation TestSetData($input: TestDataInput!) {
          testSetData(input: $input) {
            items {
              sku
              retailPrice
              onHand
            }
          }
        }
      `),
      variables: { input },
    });
  }

  async clearData() {
    return await this.graphqlClient.mutate({
      mutation: gql(`mutation Mutation {
        testClearData
      }
      `),
    });
  }
}
