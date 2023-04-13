/* eslint-disable import/no-extraneous-dependencies */
// Used only for dev purposes - to generate gql models
import { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

const { parsed: env } = dotenv.config();

if (!env) {
  throw new Error('Missing .env for graphql-codegen');
}

const codegenConfig: CodegenConfig = {
  schema: env.API_URL,
  documents: ['src/**/*.tsx'],
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
  ignoreNoDocuments: true,
};

export default codegenConfig;
