import { Enquete } from './models/Enquete.js';
import { EnqueteItem } from './models/EnqueteItem.js';
import { EnqueteVoto } from './models/EnqueteVoto.js';

import AWS from 'aws-sdk';
import { DynamoDB } from "@aws-sdk/client-dynamodb";

AWS.config.update({
  "region" : "us-east-1",
  "endpoint":"http://dynamodb.us-east-1.amazonaws.com",
  "acessKeyId":process.env.acessKeyId,
  "secretAcessKey":process.env.secretAcessKey
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();


const resolvers = {
  Query: {
    enquetes: async () =>  {
      var params = {
          TableName: 'Enquete'
      }

      try {
          const dados = await dynamoDb.scan(params).promise();
          return dados.Items;
        } catch (err) {
          console.log('err', err);
          return null;
      }
    },

    enquetePorNome: async (_, { nomeEnquete }) => {
      var params = {
        TableName: 'Enquete',
        FilterExpression: "nome = :nome",
        ExpressionAttributeValues: {
            ":nome": nomeEnquete
        }
      }

      try {
          const dados = await dynamoDb.scan(params).promise();          
          return new Enquete(dados.Items[0].nome);
        } catch (err) {
          console.log('err', err);
          return null;
      }
    },

    enqueteItens: async () =>  {
      var params = {
          TableName: 'EnqueteItem'
      }

      try {
          const dados = await dynamoDb.scan(params).promise();
          return dados.Items;
        } catch (err) {
          console.log('err', err);
          return null;
      }      
    },  

    enqueteItensPorNome: async (_, { nomeEnquete }) => {
      var params = {
        TableName: 'EnqueteItem',
        FilterExpression: "nomeEnquete = :nome",
        ExpressionAttributeValues: {
            ":nome": nomeEnquete
        }
      }

      try {
          const dados = await dynamoDb.scan(params).promise();
          return dados.Items;
        } catch (err) {
          console.log('err', err);
          return null;
      }      
    },  

    votosEnquetes: async () =>  {
      var params = {
        TableName: 'EnqueteVoto'
      }

      try {
          const dados = await dynamoDb.scan(params).promise();
          return dados.Items;
        } catch (err) {
          console.log('err', err);
          return null;
      }
    },

    votosPorEnquete: async (_, { nomeEnquete }) => {
      var params = {
        TableName: 'EnqueteVoto'
      }

      try {
          const dados = await dynamoDb.scan(params).promise();
          return dados.Items;
        } catch (err) {
          console.log('err', err);
          return null;
      }
    },
  },  
  Mutation: {
    votarEnquete: async (_, { nomeEnquete, opcao }) => {
      try {
        const params = {
          TableName: 'EnqueteVoto',
          Item: {
            nomeEnquete: nomeEnquete,
            opcao: opcao
          }
        }
     
        await dynamoDb.put(params).promise();
        return new EnqueteVoto(nomeEnquete, opcao);
      } catch (error) {
        console.error('Erro ao criar voto da enquete:', error);
        return 'erro null';
      }
    },

    criarEnquete: async (_, { nomeEnquete }) => {
      try {
        const params = {
          TableName: 'Enquete',
          Item: {
            nome: nomeEnquete
          }
        }
     
        await dynamoDb.put(params).promise();
        return new Enquete(nomeEnquete);
      } catch (error) {
        console.error('Erro ao criar enquete:', error);
        return 'erro null';
      }
    },

    criarEnqueteItem: async (_, { nomeEnquete, opcao }) => {
      try {
        const params = {
          TableName: 'EnqueteItem',
          Item: {
            nomeEnquete: nomeEnquete,
            opcao: opcao
          }
        }
     
        await dynamoDb.put(params).promise();
        return new EnqueteItem(nomeEnquete, opcao);
      } catch (error) {
        console.error('Erro ao criar item da enquete:', error);
        return 'erro null';
      }
    },
  },
};

export { resolvers };

