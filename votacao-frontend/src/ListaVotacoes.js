// Arquivo: src/ListaVotacoes.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NovaVotacao from "./NovaVotacao";
import "./ListaVotacoes.scss";
import { FiPlus } from "react-icons/fi";

const ListaVotacoes = () => {
	const [votacoes, setVotacoes] = useState([]);

	useEffect(() => {
		// Obter a lista de votações do backend (mock de exemplo)
		const votacoesMock = [
			{
				nome: "Qual a cor favorita",
				url: "/175812284",
			},
			{
				nome: "Qual o time de futebol favorito",
				url: "/175812285",
			},
		];
		setVotacoes(votacoesMock);

		// Código do fetch comentado
		// fetch("/api/enquetes")
		//   .then((response) => response.json())
		//   .then((data) => setVotacoes(data))
		//   .catch((error) => console.log("Ocorreu um erro ao obter as votações:", error));
	}, []);

	const handleNovaVotacao = (nomeVotacao) => {
		// Lógica para criar a nova votação no backend e atualizar a lista de votações
		const novaVotacao = {
			nome: nomeVotacao,
			url: `/${Math.floor(Math.random() * 100000000)}`, // Exemplo de URL gerada aleatoriamente
		};

		setVotacoes([...votacoes, novaVotacao]);
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
