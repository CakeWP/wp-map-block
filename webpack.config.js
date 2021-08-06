const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

const config = {
	...defaultConfig,
	entry: {
		"wpmapblock.core.min": "./src/blocks.js",
	},
	output: {
		path: path.resolve(__dirname, "assets/dist"),
		filename: "[name].js",
	},
	plugins: [...defaultConfig.plugins, new CleanWebpackPlugin()],
};

module.exports = config;
