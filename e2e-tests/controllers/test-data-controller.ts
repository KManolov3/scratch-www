import { ApolloClient, InMemoryCache } from '@apollo/client/core/index.js';
import * as dotenv from 'dotenv';
import { gql } from '__generated__/gql.ts';
import { TestDataInput } from '__generated__/graphql.ts';

dotenv.config();

const SET_DATA_MUTATION = gql(`
  mutation TestSetData($input: TestDataInput!) {
    testSetData(input: $input) {
      items {
        sku
        retailPrice
        onHand
      }
    }
  }
`);

const CLEAR_DATA_MUTATION = gql(`mutation TestClearData {
        testClearData
      }
      `);

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
      mutation: SET_DATA_MUTATION,
      variables: { input },
    });
  }

  async clearData() {
    return await this.graphqlClient.mutate({
      mutation: CLEAR_DATA_MUTATION,
    });
  }
}
