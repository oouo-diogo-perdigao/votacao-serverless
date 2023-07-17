import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import PropTypes from "prop-types";
import { withRouter } from "./config/withRouter";
import axios from "axios";
import "./Votacao.scss";

class VotacaoComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			votacao: null,
			voto: null,
			socket: null,
		};
	}

	componentDidMount() {
		const { id } = this.props;
		//pega do localstorage um array com as votações que o usuário já votou
		const votacoesJaVotadas = JSON.parse(
			localStorage.getItem("votacoesJaVotadas") ?? "[]"
		);
		//Se o usuário já votou nessa votação, considera que o voto já foi computado
		if (votacoesJaVotadas.includes(id)) {
			this.setState({ voto: "Voto já computado" });
		}

		console.log("Abrindo conexão com o websocket");

		// Abrir a conexão do websocket
		const socket = new WebSocket(
			"wss://d03zju3xta.execute-api.sa-east-1.amazonaws.com/production"
		);
		this.setState({ socket });

		// Função de callback para quando a conexão estiver aberta
		socket.addEventListener("open", () => {
			// registra interesse em escutar votacao
			console.log("registrando interesse em votacao");
			const payload = JSON.stringify({ action: "registerInRoom", votacao: id });
			socket.send(payload);

			socket.addEventListener("message", (event) => {
				console.log("Mensagem recebida:", event.data);

				const data = JSON.parse(event.data);
				if (data.action === "vote") {
					const { votacao } = this.state;
					const newVotacao = { ...votacao };
					newVotacao.opcoes[data.message.opcao] += 1;
					this.setState({ votacao: newVotacao });
				}
			});
		});

		axios
			.post(
				"https://htbplunnk3vj53gpjtvxvyhbu40myfwm.lambda-url.us-east-1.on.aws/",
				{
					query: `query Query($enqueteItensPorIdAuxId: String!) {
								enqueteItensPorIdAux(id: $enqueteItensPorIdAuxId) {
									nomeEnquete
									opcao
									id
								}
							}`,
					variables: { enqueteItensPorIdAuxId: String(id) },
				}
			)
			.then((response) => {
				const opcoesNomes =
					response?.data?.data?.enqueteItensPorIdAux?.map(
						(item) => item.opcao
					) ?? null;

				const nome =
					response?.data?.data?.enqueteItensPorIdAux[0].nomeEnquete ??
					"Votação Encerrada";

				//Converte array de opções em objeto com chave sendo nome e votos sendo 0
				const opcoes = {};
				opcoesNomes?.forEach((opcao) => {
					opcoes[opcao] = 0;
				});

				this.setState({
					votacao: {
						nome,
						opcoes,
					},
				});

				// Pega os votos que ja foram computados nessa enquete e guarda no state
				axios
					.post(
						"https://htbplunnk3vj53gpjtvxvyhbu40myfwm.lambda-url.us-east-1.on.aws/",
						{
							query: `query Query($votosPorEnqueteAuxId: String!) {
							votosPorEnqueteAux(id: $votosPorEnqueteAuxId) {
								contador
								opcao
							}
						}`,
							variables: { votosPorEnqueteAuxId: String(id) },
						}
					)
					.then((response) => {
						//converter array de votos em objeto com chave sendo nome e votos sendo contador
						const votos = {};
						response?.data?.data?.votosPorEnqueteAux?.forEach((voto) => {
							votos[voto.opcao] = voto.contador;
						});
						const { votacao } = this.state;
						const newVotacao = { ...votacao };
						newVotacao.opcoes = votos;
						this.setState({ votacao: newVotacao });
					});
			})
			.catch((error) => {
				console.log("Ocorreu um erro ao obter a votação:", error);
			});
	}

	handleVoto = (opcao) => {
		const { id } = this.props;
		const { socket, votacao, voto } = this.state;

		if (!voto) {
			this.setState({ voto: opcao });

			// Enviar comando para o websocket com o id da votação e a opção votada
			const payload = JSON.stringify({
				action: "sendVote",
				votacao: id,
				opcao,
			});
			socket?.send(payload);
			console.log("Voto computado:", payload);

			const response = axios
				.post(
					"https://htbplunnk3vj53gpjtvxvyhbu40myfwm.lambda-url.us-east-1.on.aws/",
					{
						query: `mutation {
						votarEnqueteAux(nomeEnquete: "${votacao.nome}", opcao: "${opcao}", id: "${id}") {
								contador
								opcao
							}
					  }`,
					}
				)
				.then((response) => {
					const { contador, opcao } = response.data.data.votarEnqueteAux;

					const newVotacao = { ...votacao };
					newVotacao.opcoes[opcao] = contador;
					newVotacao.status = true;
					this.setState({ votacao: newVotacao });

					//Guarda no localstorage um array com as votações que o usuário já votou
					const votacoesJaVotadas = JSON.parse(
						localStorage.getItem("votacoesJaVotadas") ?? "[]"
					);
					votacoesJaVotadas.push(id);
					localStorage.setItem(
						"votacoesJaVotadas",
						JSON.stringify(votacoesJaVotadas)
					);
				});
		}
	};

	componentWillUnmount() {
		const { socket } = this.state;
		if (socket) {
			socket.close();
		}
	}

	render() {
		const { votacao, voto } = this.state;

		return (
			<div className="Votacao">
				{votacao ? (
					<div>
						<h1>{votacao.nome}</h1>
						<p>
							{votacao.status ? "Já Votado" : ""}{" "}
							{voto && <>Você votou em: {voto}</>}
						</p>
						<Link to="/" className="btn-home">
							<FiHome />
						</Link>
						<h2>Opções:</h2>
						<ul className="votacao-opcoes">
							{Object.keys(votacao.opcoes).length > 0 ? (
								Object.entries(votacao.opcoes).map(([opcao, votos]) => (
									<li
										key={opcao}
										className={voto === opcao ? "votada" : ""}
										onClick={() => this.handleVoto(opcao)}
									>
										{opcao}{" "}
										{votacao.status ? (
											<span className="votos-indicador">({votos})</span>
										) : null}
									</li>
								))
							) : (
								<li>Nenhuma opção disponível</li>
							)}
						</ul>
					</div>
				) : (
					<p>Carregando...</p>
				)}
			</div>
		);
	}
}

VotacaoComponent.propTypes = {
	id: PropTypes.number.isRequired,
};

/**
 * Classe da tela do componente de chat
 * @class RoomComponent
 * @param {*} props
 * @return {Component}
 */
export const Votacao = withRouter((props) => {
	return <VotacaoComponent id={parseInt(props.router.params.id)} />;
});
