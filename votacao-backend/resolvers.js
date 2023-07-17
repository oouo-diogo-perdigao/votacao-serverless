import { Enquete } from './models/Enquete.js';
import { EnqueteItem } from './models/EnqueteItem.js';
import { EnqueteItemAux } from './models/EnqueteItemAux.js';
import { EnqueteVoto } from './models/EnqueteVoto.js';

import AWS from 'aws-sdk';
import { DynamoDB } from "@aws-sdk/client-dynamodb";

AWS.config.update({
  "region" : "us-east-1",
  "endpoint":"http://dynamodb.us-east-1.amazonaws.com",
  "acessKeyId":"AKIA2XDUIYKYUZ4VP3LX",
  "secretAcessKey":"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"
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

    enquetesAux: async () =>  {
      var params = {
          TableName: 'EnqueteAux'
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

    enquetePorNomeAux: async (_, { nomeEnquete }) => {
      var params = {
        TableName: 'EnqueteAux',
        FilterExpression: "nomeEnquete = :nomeEnquete",
        ExpressionAttributeValues: {
            ":nomeEnquete": nomeEnquete
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

    enqueteItensAux: async () =>  {
      var params = {
          TableName: 'EnqueteItemAux'
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

    enqueteItensPorNomeAux: async (_, { nomeEnquete }) => {
      var params = {
        TableName: 'EnqueteItemAux',
        FilterExpression: "nomeEnquete = :nomeEnquete",
        ExpressionAttributeValues: {
            ":nomeEnquete": nomeEnquete
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

    enqueteItensPorIdAux: async (_, { id }) => {
      var params = {
        TableName: 'EnqueteItemAux',
        FilterExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
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

    votosEnquetesAux: async () =>  {
      var params = {
        TableName: 'EnqueteVotoAux'
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
      // Atualizar o contador do voto
      const updateParams = {
        TableName: 'EnqueteVoto',
        Key: {
          nomeEnquete: nomeEnquete,
          opcao: opcao,
        },
        UpdateExpression: 'SET contador = if_not_exists(contador, :start) + :incr',
        ExpressionAttributeValues: {
          ':start': 0,
          ':incr': 1,
        },
        ReturnValues: 'ALL_NEW',
      };

      let novoContador;
      try {
        const result = await dynamoDb.update(updateParams).promise();
        novoContador = result.Attributes.contador;
      } catch (error) {
        console.error('Erro ao atualizar o contador:', error);
        throw new Error('Ocorreu um erro ao atualizar o contador.');
      }

      // Salvar o voto na tabela EnqueteVoto
      const votoParams = {
        TableName: 'EnqueteVoto',
        Item: {
          nomeEnquete,
          opcao,
          contador: novoContador,
        },
      };

      try {
        await dynamoDb.put(votoParams).promise();
        return votoParams.Item;
      } catch (error) {
        console.error('Erro ao cadastrar o voto:', error);
        throw new Error('Ocorreu um erro ao cadastrar o voto.');
      }
    },

    votarEnqueteAux: async (_, { nomeEnquete, opcao, id }) => {
      // Atualizar o contador do voto
      const updateParams = {
        TableName: 'EnqueteVotoAux',
        Key: {
          nomeEnquete: nomeEnquete,
          opcao: opcao
        },
        UpdateExpression: 'SET contador = if_not_exists(contador, :start) + :incr',
        ExpressionAttributeValues: {
          ':start': 0,
          ':incr': 1,
        },
        ReturnValues: 'ALL_NEW',
      };

      let novoContador;
      try {
        const result = await dynamoDb.update(updateParams).promise();
        novoContador = result.Attributes.contador;
      } catch (error) {
        console.error('Erro ao atualizar o contador:', error);
        throw new Error('Ocorreu um erro ao atualizar o contador.');
      }

      // Salvar o voto na tabela EnqueteVoto
      const votoParams = {
        TableName: 'EnqueteVotoAux',
        Item: {
          nomeEnquete,
          opcao,
          contador: novoContador,
          id
        },
      };

      try {
        await dynamoDb.put(votoParams).promise();
        return votoParams.Item;
      } catch (error) {
        console.error('Erro ao cadastrar o voto:', error);
        throw new Error('Ocorreu um erro ao cadastrar o voto.');
      }
    },


    criarEnqueteAux: async (_, { nomeEnquete }) => {
      /*
      // Atualizar o contador do voto
      const updateParams = {
        TableName: 'EnqueteAux',
        Key: {
          nomeEnquete: nomeEnquete,          
        },
        UpdateExpression: 'SET id = if_not_exists(id, :start) + :incr',
        ExpressionAttributeValues: {
          ':start': 0,
          ':incr': 1,
        },
        ReturnValues: 'ALL_NEW',
      };

      let novoContador;
      try {
        const result = await dynamoDb.update(updateParams).promise();
        novoContador = result.Attributes.id;
      } catch (error) {
        console.error('Erro ao atualizar o contador:', error);
        throw new Error('Ocorreu um erro ao atualizar o contador.');
      }
      */


      var paramsSelect = {
        TableName: 'EnqueteAux'
      }

      let novoContador;

      try {
        const dados = await dynamoDb.scan(paramsSelect).promise();
        novoContador = dados.Items.length+1;
      } catch (err) {
        console.log('err', err);
        return null;
      }

      // Salvar o voto na tabela EnqueteVoto
      const votoParams = {
        TableName: 'EnqueteAux',
        Item: {
          nomeEnquete,          
          id: novoContador,
        },
      };

      try {
        await dynamoDb.put(votoParams).promise();
        return votoParams.Item;
      } catch (error) {
        console.error('Erro ao cadastrar o voto:', error);
        throw new Error('Ocorreu um erro ao cadastrar o voto.');
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

    criarEnqueteItemAux: async (_, { nomeEnquete, opcao, id }) => {
      try {
        const params = {
          TableName: 'EnqueteItemAux',
          Item: {
            nomeEnquete: nomeEnquete,
            opcao: opcao,
            id: id
          }
        }
     
        await dynamoDb.put(params).promise();
        return new EnqueteItemAux(nomeEnquete, opcao, id);
      } catch (error) {
        console.error('Erro ao criar item da enquete:', error);
        return 'erro null';
      }
    },

  },
};

export { resolvers };

