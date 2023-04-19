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
  config: {
    defaultScalarType: 'unknown',
    scalars: {
      Date: 'string',
    },
  },
  generates: {
    './src/__generated__/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',

        // See https://the-guild.dev/blog/unleash-the-power-of-fragments-with-graphql-codegen
        // Decided to disable fragment masking because it needs an additional `useFragment` hook
        // which makes the component a bit less reusable and is additional boilerplate. And the
        // things masking protects from (using properties from sub-fragments) is something
        // that is easily caught by TS if it becomes a problem.
        fragmentMasking: false,
      },
    },
  },
  ignoreNoDocuments: true,
};

export default codegenConfig;
