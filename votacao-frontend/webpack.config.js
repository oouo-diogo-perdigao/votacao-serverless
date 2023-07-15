// Arquivo: webpack.config.js
module.exports = {
	// ... outras configurações do Webpack

	module: {
		rules: [
			// ... outras regras

			// Regra para processar arquivos SCSS
			{
				test: /\.scss$/,
				use: [
					"style-loader", // Carrega os estilos injetando tags <style> no DOM
					"css-loader", // Interpretar @import e url() como import/require()
					"sass-loader", // Compila SCSS para CSS
				],
			},
		],
	},
};
