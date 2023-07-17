// Arquivo: src/ListaVotacoes.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./ListaVotacoes.scss";
import { FiPlus } from "react-icons/fi";
import axios from "axios";

const ListaVotacoes = () => {
	const [votacoes, setVotacoes] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				//const response = await axios.post("https://htbplunnk3vj53gpjtvxvyhbu40myfwm.lambda-url.us-east-1.on.aws/", {
				const response = await axios.post("http://localhost:4000/", {
					query: `
					query Query {
						enquetesAux {
							nomeEnquete,
							id
						}
					}		
				`,
				});

				const { enquetesAux } = response.data.data;
				enquetesAux.forEach((enquete) =>
					handleNovaVotacao(enquete.nomeEnquete, enquete.id)
				);
			} catch (error) {
				console.log("Ocorreu um erro ao obter as enquetes:", error);
			}
		};

		fetchData();
	}, []);

	const handleNovaVotacao = (nomeVotacao, id) => {
		// Lógica para criar a nova votação no backend e atualizar a lista de votações
		const novaVotacao = {
			nome: nomeVotacao,
			url: `/${id}`,
			//url: `/${Math.floor(Math.random() * 100000000)}`, // Exemplo de URL gerada aleatoriamente
		};

		setVotacoes((prevVotacoes) => [...prevVotacoes, novaVotacao]);
	};

	return (
		<div className="ListaVotacoes">
			<h1>Lista de Votações</h1>
			<Link to="/nova-votacao" className="link-texto">
				<button className="nova-votacao">
					<FiPlus />
				</button>
			</Link>

			<ul>
				{votacoes.map((votacao) => {
					return (
						<li key={votacao.nome}>
							<Link to={votacao.url} className="link-texto">
								{votacao.nome}
								<button>Iniciar Votação</button>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default ListaVotacoes;
