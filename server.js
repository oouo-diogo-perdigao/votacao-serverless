import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServer } from '@apollo/server';
import { resolvers } from './resolvers.js';
import { typeDefs } from './schema.js';

const server = new ApolloServer({ typeDefs, resolvers});
const { url } = await startStandaloneServer(server, {listen: 3000});
console.log(`Servidor Apollo em execução em ${url}`);