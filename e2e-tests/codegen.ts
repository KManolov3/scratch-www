/* eslint-disable import/no-extraneous-dependencies */
// Used only for dev purposes - to generate gql models
import { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenv from 'dotenv';

const { parsed: env } = dotenv.config();

if (!env) {
  throw new Error('Missing .env for graphql-codegen');
}

const codegenConfig: CodegenConfig = {
  schema: env.APOLLO_CLIENT_URI,
  documents: ['**/*.ts'],
  config: {
    defaultScalarType: 'unknown',
    scalars: {
      Date: 'string',
    },
  },
  generates: {
    './__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: false,
      },
    },
  },
};

export default codegenConfig;
