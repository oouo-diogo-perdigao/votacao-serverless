// Arquivo: src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ListaVotacoes from "./ListaVotacoes";
import Votacao from "./Votacao";
import NovaVotacao from "./NovaVotacao";
import "./App.scss";

const App = () => {
	return (
		<Router>
			<div className="container">
				<Routes>
					<Route path="/" element={<ListaVotacoes />} />
					<Route path="/:id" element={<Votacao />} />
					<Route path="/nova-votacao" element={<NovaVotacao />} />
				</Routes>
			</div>
		</Router>
	);
};

export default App;
