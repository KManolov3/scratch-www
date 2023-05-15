import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { schema } from './schema.js';

const server = new ApolloServer({ schema });

const { url } = await startStandaloneServer(server, {
  listen: { port: 1337 },
});

// eslint-disable-next-line no-console
console.log(`🚀 Server ready at: ${url}`);
