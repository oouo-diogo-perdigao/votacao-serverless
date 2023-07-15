import { buildSchema } from 'graphql';

const typeDefs = buildSchema(`
  type Enquete {
    nome: String
  }

  type EnqueteItem {
    nomeEnquete: String
    opcao: String
  }

  type EnqueteVoto {
    nomeEnquete: String
    opcao: String
  }

  type Query {
    enquetes: [Enquete]
    enquetePorNome(nomeEnquete: String!): Enquete    

    enqueteItens: [EnqueteItem]    
    enqueteItensPorNome(nomeEnquete: String!): [EnqueteItem]

    votosEnquetes: [EnqueteVoto]    
    votosPorEnquete(nomeEnquete: String!): [EnqueteVoto]
  }

  type Mutation {
    votarEnquete(nomeEnquete: String, opcao: String): EnqueteVoto
    criarEnquete(nomeEnquete: String): Enquete    
    criarEnqueteItem(nomeEnquete: String, opcao: String): EnqueteItem
  } 
`);

export { typeDefs };
