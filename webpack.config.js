const path = require('path');

module.exports = {
	entry: {
		app: './src/js/main.js'
	},
	mode: 'production',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist'
	},
	devServer: {
		overlay: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules/'
			}
		]
	}
};
