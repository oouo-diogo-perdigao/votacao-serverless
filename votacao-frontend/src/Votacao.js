import React, { Component } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import "./Votacao.scss";

class Votacao extends Component {
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

		// Mock da chamada GET /api/enquete/:id
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

		// Limpando o timeout para evitar vazamentos de memória
		// Código do fetch comentado
		// fetch(`/api/enquete/${id}`)
		//   .then((response) => response.json())
		//   .then((data) => setVotacao(data))
		//   .catch((error) => console.log("Ocorreu um erro ao obter a votação:", error));
	}

	handleVoto = (opcao) => {
		const { id } = this.props;
		const { socket, votacao, voto } = this.state;

		if (!voto) {
			this.setState({ voto: opcao });

			const newVotacao = { ...votacao };
			newVotacao.status = true;
			this.setState({ votacao: newVotacao });

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
							{voto && <p>Você votou em: {voto}</p>}
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

export default Votacao;
