import { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv'

const { parsed: env } = dotenv.config()

console.log(env)

if (!env) {
  throw new Error('Missing .env for graphql-codegen')
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
      }
    }
  },
  ignoreNoDocuments: true,
};

export default codegenConfig;
