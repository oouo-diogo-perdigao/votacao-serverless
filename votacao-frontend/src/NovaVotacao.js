import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./NovaVotacao.scss";
import axios from "axios";
import { FiMinus, FiPlus, FiHome } from "react-icons/fi";

const NovaVotacao = () => {
	const [titulo, setTitulo] = useState("");
	const [opcoes, setOpcoes] = useState(["Opção 1", "Opção 2"]);
	const [loading, setLoading] = useState(false);
	const [votacaoUrl, setVotacaoUrl] = useState(false);

	const handleTituloChange = (event) => {
		setTitulo(event.target.value);
	};

	const handleOpcaoChange = (index, event) => {
		const newOpcoes = [...opcoes];
		newOpcoes[index] = event.target.value;
		setOpcoes(newOpcoes);
	};

	const handleAdicionarOpcao = () => {
		setOpcoes([...opcoes, ""]);
	};

	const handleRemoverOpcao = (index) => {
		const newOpcoes = [...opcoes];
		newOpcoes.splice(index, 1);
		setOpcoes(newOpcoes);
	};

	const handleNovaVotacao = async () => {
		setLoading(true);

		try {
			const response = await axios.post(
				"https://htbplunnk3vj53gpjtvxvyhbu40myfwm.lambda-url.us-east-1.on.aws/",
				{
					query: `mutation {
							criarEnqueteAux(nomeEnquete: "${titulo}") {
								nomeEnquete
								id
							}
					  }`,
				}
			);

			const id = response.data.data.criarEnqueteAux.id;

			for (const opcao of opcoes) {
				await axios.post(
					"https://htbplunnk3vj53gpjtvxvyhbu40myfwm.lambda-url.us-east-1.on.aws/",
					{
						query: `mutation {
								criarEnqueteItemAux(nomeEnquete: "${titulo}", opcao: "${opcao}", id: "${id}") {
									nomeEnquete
									opcao
									id
						  	}
							}`,
					}
				);
			}

			setVotacaoUrl(id);
		} catch (error) {
			console.log("Ocorreu um erro ao enviar a votação:", error);
		}

		// setLoading(false);
	};

	if (votacaoUrl) {
		return <Navigate to={"/" + votacaoUrl} />;
	}

	return (
		<div className="novaVotacao">
			{loading ? (
				<p>Enviando votação...</p>
			) : (
				<div>
					<h1>Criar Nova Votação</h1>
					<Link to="/" className="btn-home">
						<FiHome />
					</Link>
					<div className="opcao">
						<input
							type="text"
							placeholder="Título da Votação"
							value={titulo}
							onChange={handleTituloChange}
						/>
					</div>
					Opções:
					<br />
					<br />
					{opcoes.map((opcao, index) => (
						<div className="opcao" key={index}>
							<input
								type="text"
								placeholder={`Opção ${index + 1}`}
								value={opcao}
								onChange={(event) => handleOpcaoChange(index, event)}
							/>
							{opcoes.length > 2 && (
								<button
									onClick={() => handleRemoverOpcao(index)}
									className="botao-remover"
								>
									<FiMinus />
								</button>
							)}
						</div>
					))}
					<button onClick={handleAdicionarOpcao} className="botao-adicionar">
						<FiPlus />
					</button>
					<button onClick={handleNovaVotacao} className="botao-grande">
						Adicionar Votação
					</button>
				</div>
			)}
		</div>
	);
};

export default NovaVotacao;
