import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "./NovaVotacao.scss";
import axios from "axios";
import { FiMinus, FiPlus, FiHome } from "react-icons/fi";

const NovaVotacao = () => {
	const [titulo, setTitulo] = useState("");
	const [opcoes, setOpcoes] = useState([""]);
	const [loading, setLoading] = useState(false);
	const [votacaoUrl, setVotacaoUrl] = useState(null);
	const [novaOpcao, setNovaOpcao] = useState("");

	const handleTituloChange = (event) => {
		setTitulo(event.target.value);
	};

	const handleOpcaoChange = (index, event) => {
		const newOpcoes = [...opcoes];
		newOpcoes[index] = event.target.value;
		setOpcoes(newOpcoes);
	};

	const handleAdicionarOpcao = () => {
		if (novaOpcao.trim() !== "") {
			setOpcoes([...opcoes, novaOpcao]);
			setNovaOpcao("");
		}
	};

	const handleRemoverOpcao = (index) => {
		const newOpcoes = [...opcoes];
		newOpcoes.splice(index, 1);
		setOpcoes(newOpcoes);
	};

	const handleNovaVotacao = async () => {
		setLoading(true);

		try {
			//const response = await axios.post("https://htbplunnk3vj53gpjtvxvyhbu40myfwm.lambda-url.us-east-1.on.aws/", {
			const response = await axios.post("http://localhost:4000/", {
				query: `
				  mutation {
					criarEnqueteAux(nomeEnquete: "${titulo}") {
					  nomeEnquete
					  id
					}
				  }
				`,
			});

			const id = response.data.data.criarEnqueteAux.id;
			//alert(id);
			setVotacaoUrl(id);

			for (const opcao of opcoes) {
				//await axios.post("https://htbplunnk3vj53gpjtvxvyhbu40myfwm.lambda-url.us-east-1.on.aws/", {
				await axios.post("http://localhost:4000/", {
					query: `
					mutation {
					  criarEnqueteItemAux(nomeEnquete: "${titulo}", opcao: "${opcao}", id: "${id}") {						                                                               
						nomeEnquete
						opcao
						id
					  }
					}
				  `,
				});
			}
		} catch (error) {
			console.log("Ocorreu um erro ao enviar a votação:", error);
		}

		setLoading(false);
	};

	if (votacaoUrl) {
		return <Navigate to={votacaoUrl} />;
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

					<input
						type="text"
						placeholder="Título da Votação"
						value={titulo}
						onChange={handleTituloChange}
					/>
					{opcoes.map((opcao, index) => (
						<div className="opcao" key={index}>
							<input
								type="text"
								placeholder={`Opção ${index + 1}`}
								value={opcao}
								onChange={(event) => handleOpcaoChange(index, event)}
							/>
							{opcoes.length > 1 && (
								<button
									onClick={() => handleRemoverOpcao(index)}
									className="botao-remover"
								>
									<FiMinus />
								</button>
							)}
						</div>
					))}

					<div className="opcao">
						<input
							type="text"
							placeholder="Adicionar Opção"
							value={novaOpcao}
							onChange={(event) => setNovaOpcao(event.target.value)}
						/>
						<button
							onClick={handleAdicionarOpcao}
							disabled={!novaOpcao}
							className="botao-adicionar"
						>
							<FiPlus />
						</button>
					</div>
					<button onClick={handleNovaVotacao} className="botao-grande">
						Adicionar Votação
					</button>
				</div>
			)}
		</div>
	);
};

export default NovaVotacao;
