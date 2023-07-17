
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from '@apollo/server';
import { resolvers } from './resolvers.js';
import { typeDefs } from './schema.js';

const server = new ApolloServer({ typeDefs, resolvers});
const { url } = await startStandaloneServer(server, {listen: 4000});
console.log(`Servidor Apollo em execução em ${url}`);


/*
import { ApolloServer } from 'apollo-server-lambda';
import { resolvers } from './resolvers.js';
import { typeDefs } from './schema.js';

const server = new ApolloServer({typeDefs, resolvers});

export const handler = server.createHandler({
  cors: {
    origin: '*', // Defina a origem permitida conforme necessário
    credentials: true,
  },
});
*/