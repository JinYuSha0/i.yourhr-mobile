var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(__dirname, 'index.js');
var BUILD_PATH = path.resolve(__dirname, './build');

module.exports = {
	entry: [
		APP_PATH
	],
	output: {
		path: BUILD_PATH,
		publicPath: 'http://ge.yourhr.com.cn/zy-mobile/',
		filename: 'bundle.js',
		chunkFilename: '[name].chunk.js',
	},
	module: {
		loaders: [
			{test: /\.css$/,loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: [{
				loader: 'css-loader',
				options:{
					minimize: true //css压缩
				}
			}, 'autoprefixer-loader'] })},
			{test: /\.less$/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: [{
				loader: 'css-loader',
				options:{
					minimize: true //css压缩
				}
			}, 'autoprefixer-loader', 'less-loader'] })},
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
				NODE_ENV: JSON.stringify('production'),
			},
		}),
		new ExtractTextPlugin("styles/main.css"),
		new webpack.optimize.UglifyJsPlugin({
			output: {
				comments: false
			},
			compress: {
				warnings: false
			}
		})
	]
}