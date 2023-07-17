import { buildSchema } from "graphql";

const typeDefs = buildSchema(`
  type Enquete {
    nome: String
  }

  type EnqueteAux {
    nomeEnquete: String
    id: Int
  }

  type EnqueteItem {
    nomeEnquete: String
    opcao: String
  }

  type EnqueteItemAux {
    nomeEnquete: String
    opcao: String
    id: String
  }

  type EnqueteVoto {
    nomeEnquete: String
    opcao: String
    contador: Int
  }

  type EnqueteVotoAux {
    nomeEnquete: String
    opcao: String
    contador: Int
    id: String
  }

  type Query {
    enquetes: [Enquete]
    enquetesAux: [EnqueteAux]
    enquetePorNome(nomeEnquete: String!): Enquete    
    enquetePorNomeAux(nomeEnquete: String!): EnqueteAux

    enqueteItens: [EnqueteItem]    
    enqueteItensAux: [EnqueteItemAux]    
    enqueteItensPorNome(nomeEnquete: String!): [EnqueteItem]
    enqueteItensPorNomeAux(nomeEnquete: String!): [EnqueteItemAux]
    enqueteItensPorIdAux(id: String!): [EnqueteItemAux]

    votosEnquetes: [EnqueteVoto]    
    votosEnquetesAux: [EnqueteVotoAux]    
    votosPorEnquete(nomeEnquete: String!): [EnqueteVoto]
		votosPorEnqueteAux(id: String!): [EnqueteVotoAux]
  }

  type Mutation {
    criarEnquete(nomeEnquete: String): Enquete    
    criarEnqueteAux(nomeEnquete: String): EnqueteAux    
    
    votarEnquete(nomeEnquete: String!, opcao: String!): EnqueteVoto
    votarEnqueteAux(nomeEnquete: String!, opcao: String!, id: String): EnqueteVotoAux
    
    criarEnqueteItem(nomeEnquete: String, opcao: String): EnqueteItem
    criarEnqueteItemAux(nomeEnquete: String, opcao: String, id: String): EnqueteItemAux
  } 
`);

export { typeDefs };
