var path = require('path');
var webpack = require('webpack');

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(__dirname, 'index.js');
var BUILD_PATH = path.resolve(__dirname, './build');

module.exports = {
	entry: [
		APP_PATH,
		'whatwg-fetch'
	],
	output: {
		path: BUILD_PATH,
		publicPath: '/',
		filename: 'bundle.js',
		chunkFilename: '[name].chunk.js',
	},
	module: {
		loaders: [
			{test: /\.css$/,loader: 'style-loader!css-loader'},
			{test: /\.less$/, loader: 'style-loader!css-loader?importLoaders=2!autoprefixer-loader!less-loader', },
			{test: /\.(png|jpg|gif)$/,loader: 'url-loader?limit=50000'},
			{test: /\.jsx?$/,loaders: ["babel-loader?presets[]=es2015,presets[]=react,presets[]=stage-0"], exclude: /node_modules/}
		]
	},
	resolve: {
		modules: ['node_modules', path.join(__dirname, './node_modules')],
		extensions: ['.web.js', '.js', '.json']
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('development'),
			},
		}),
		new webpack.HotModuleReplacementPlugin(),
	]
};

