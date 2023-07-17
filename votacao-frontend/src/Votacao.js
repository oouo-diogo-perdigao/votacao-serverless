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
		console.log("id", id);

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

		const fetchData = async () => {
			try {
				//const response = await axios.post("https://htbplunnk3vj53gpjtvxvyhbu40myfwm.lambda-url.us-east-1.on.aws/", {
				const response = await axios.post("http://localhost:4000/", {
					query: `
				query Query($enqueteItensPorIdAuxId: String!) {
					enqueteItensPorIdAux(id: $enqueteItensPorIdAuxId) {
					  nomeEnquete
					  opcao
					  id
					}
				  }
				`,
					variables: { enqueteItensPorIdAuxId: "${id}" },
				});

				const { enqueteItensPorIdAux } =
					response.data.data.enqueteItensPorIdAux;
				const opcoes = enqueteItensPorIdAux.map((item) => item.opcao);

				const mockVotacao = {
					nome: enqueteItensPorIdAux[0].nomeEnquete,
					opcoes: opcoes,

					/*opcoes: opcoes.reduce((acc, opcao) => {
					acc[opcao] = 0;
					return acc;
				  }, {}),*/
					status: false,
				};
				this.setState({ votacao: mockVotacao });
				/*
			  const mockVotacao = {
				nome: "Qual a cor favorita",
				opcoes: {
					Azul: 0,
					Amarelo: 0,
					Verde: 0,
				},
				status: false,
			};
	
			// Simulando o tempo de espera da chamada
			const delay = setTimeout(() => {
				this.setState({ votacao: mockVotacao });
			}, 1000);
			*/
			} catch (error) {
				console.log("Ocorreu um erro ao obter a votação:", error);
			}
		};

		fetchData();
	}

	handleVoto = (opcao) => {
		const { id } = this.props;
		const { socket, votacao, voto } = this.state;

		if (!voto) {
			this.setState({ voto: opcao });

			const newVotacao = { ...votacao };
			newVotacao.status = true;
			this.setState({ votacao: newVotacao });

			console.log(id);

			// Enviar comando para o websocket com o id da votação e a opção votada
			const payload = JSON.stringify({
				action: "sendVote",
				votacao: id,
				opcao,
			});
			socket?.send(payload);
			console.log("Voto computado:", payload);
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
