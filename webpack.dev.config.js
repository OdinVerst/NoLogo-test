const path = require('path');

module.exports = {
	entry: {
		main: './src/js/main.js'
	},
	mode: 'development',
	devtool: 'source-map',
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist'
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
