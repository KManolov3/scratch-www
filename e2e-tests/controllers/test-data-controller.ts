import { ApolloClient, InMemoryCache, gql } from '@apollo/client/core/index.js';
import { TestDataInput } from '../../app/src/__generated__/graphql.ts';
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

  async setData(input: TestDataInput) {
    return await this.graphqlClient.mutate({
      mutation: gql(`
        mutation TestSetData($input: TestDataInput!) {
          testSetData(input: $input) {
            storeNumber
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
