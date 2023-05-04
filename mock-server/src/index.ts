import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFile } from 'fs/promises';
import { mocks } from './mocks.js';

// See https://the-guild.dev/graphql/tools/docs/mocking for documentation

const schema = await readFile('./schema.graphql', 'utf-8');

const server = new ApolloServer({
  schema: addMocksToSchema({
    schema: makeExecutableSchema({ typeDefs: schema }),
    mocks,
  }),
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 1337 },
});

// eslint-disable-next-line no-console
console.log(`🚀 Server ready at: ${url}`);
