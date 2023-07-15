const AWS = require("aws-sdk");

const ENDPOINT = "d03zju3xta.execute-api.sa-east-1.amazonaws.com/production";
const client = new AWS.ApiGatewayManagementApi({ endpoint: ENDPOINT });

const votacaoListeners = {};

const sendMessage = async (ids, body) => {
	const all = ids.map(async (connectionId) => {
		try {
			await client
				.postToConnection({
					ConnectionId: connectionId,
					Data: Buffer.from(JSON.stringify(body)),
				})
				.promise();
		} catch (error) {
			console.error("Error sending message:", error);
		}
	});
	return Promise.all(all);
};

exports.handler = async (event) => {
	if (event.requestContext) {
		const connectionId = event.requestContext.connectionId;
		const routeKey = event.requestContext.routeKey;

		let body = {};
		if (event.body) {
			// verifica se é um objeto ou um JSON
			if (typeof event.body === "string") {
				body = JSON.parse(event.body);
			} else {
				body = event.body;
			}
		}

		switch (routeKey) {
			case "$connect":
				break;

			// Remover o ouvinte registrado
			case "$disconnect":
				for (const votacao in votacaoListeners) {
					votacaoListeners[votacao] = votacaoListeners[votacao].filter(
						(listener) => listener !== connectionId
					);
					if (votacaoListeners[votacao].length == 0) {
						delete votacaoListeners[votacao];
					}
				}
				break;

			//Receber id da votação e registrar o ouvinte
			case "registerInRoom":
				const votacao = body.votacao;
				if (!votacaoListeners[votacao]) {
					votacaoListeners[votacao] = [];
				}
				votacaoListeners[votacao].push(connectionId);

				await sendMessage([connectionId], {
					action: "messageRetorno",
					message: "registrado",
				});
				break;

			case "sendVote":
				const votacaoId = body.votacao;
				const opcao = body.opcao;

				if (votacaoListeners[votacaoId]) {
					await sendMessage(votacaoListeners[votacaoId], {
						action: "vote",
						message: {
							votacao: votacaoId,
							opcao: opcao,
							plus: "blablabla",
						},
					});
					console.log({
						action: "vote",
						message: {
							votacao: votacaoId,
							opcao: opcao,
							plus: "blablabla",
						},
					});
				}
				break;
			default:
				break;
		}
	}

	let response = {
		statusCode: 200,
		headers: {
			"Access-Control-Allow-Headers": "Content-Type",
			"Access-Control-Allow-Origin": "http://localhost:3001",
			"Access-Control-Allow-Methods": "OPTIONS,POST,GET",
		},
		body: JSON.stringify("Hello from Lambda!"),
	};
	return response;
};
